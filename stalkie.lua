local stalkie = {
	services = {
		players = game:GetService("Players");
		workspace = game:GetService("Workspace");
		replicated = game:GetService("ReplicatedStorage");
		run_service = game:GetService("RunService");
		user_input_service = game:GetService("UserInputService");
        http_service = game:GetService("HttpService");
	};
	flags = {
		reanimated = false;
	};
	clones = {};
	connections = {
		hb = nil;
		died = nil;
		real_char_child_removed = nil;
		character_removing = nil;
		clone_died = nil;
		clone_char_child_removed = nil;
        animation_hb = nil;
	};
	real_chars = {};
	callbacks = {
		on_play = nil,
		on_stop = nil,
	};
	animation = {
        cache = {};
        state = {
            is_playing = false;
            current_url = nil;
            speed = 1.0;
            keyframes = nil;
            total_duration = 0;
            elapsed_time = 0;
        };
        original_motor_c0s = {};
        joints = {};
    };
};

local API = {};

local function clear_table(t)
	if not t then return end;
	for key in pairs(t) do
		t[key] = nil;
	end
end

local get_game_ragdoll_info = function(enable)
	local place_id = game.PlaceId;
	if place_id == 15546218972 or place_id == 6884319169 then
		local remote = stalkie.services.replicated:WaitForChild("event_rag");
		return remote, {"Ball"}, false;
	elseif place_id == 5991163185 then
		local remote = stalkie.services.replicated.Remotes.Physics.Ragdoll;
		return remote, {}, false;
	elseif place_id == 5683833663 then
		local local_event = stalkie.services.replicated:WaitForChild("LocalRagdollEvent");
		return local_event, {enable}, true;
	end;
	return nil, nil, false;
end;

local set_model_transparency = function(model, transparency)
	if not model then return end;
	for _, part in model:GetDescendants() do
		if part:IsA("BasePart") then
			part.Transparency = transparency;
		end;
	end;
end;

local get_local_player = function()
	local player = stalkie.services.players.LocalPlayer;
	if not player then
		return "bad argument to 'get_local_player' (LocalPlayer not found; must run in a LocalScript)";
	end;
	return player;
end;

local get_char = function(player)
	if typeof(player) ~= "Instance" or not player:IsA("Player") then
		return ("bad argument #1 to 'get_char' (Player expected, got %s)"):format(typeof(player));
	end;
	local character = player.Character;
	if not character or not character.Parent then
		return ("Player %s has no active character."):format(player.Name);
	end;
	return character;
end;

local clone_char = function(model)
	if typeof(model) ~= "Instance" then
		return ("bad argument #1 to 'clone_char' (Instance expected, got %s)"):format(typeof(model));
	end;
	model.Archivable = true;
	local new_clone = model:Clone();
	model.Archivable = false;
	new_clone.Name = "Reanimation";
	new_clone.Parent = stalkie.services.workspace;
	
	local animate = new_clone:FindFirstChild("Animate");
	if animate then
		animate.Disabled = true;
	end
	
	local humanoid = new_clone:FindFirstChild("Humanoid");
	if humanoid then
		humanoid.RequiresNeck = false;
		humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
	end
	
	if new_clone:FindFirstChildWhichIsA("ForceField") then
		new_clone:FindFirstChildWhichIsA("ForceField"):Destroy();
	end;
	return new_clone;
end;

local fire_remote = function(remote, is_local, ...)
	if typeof(remote) ~= "Instance" then
		return ("bad argument to 'fire_remote' (Instance expected, got %s)"):format(typeof(remote));
	end;
	if is_local then
		if not remote:IsA("BindableEvent") then
			return ("bad argument to 'fire_remote' (BindableEvent expected for local event, got %s)"):format(remote.ClassName);
		end;
		remote:Fire(...);
	else
		if not (remote:IsA("RemoteEvent") or remote:IsA("RemoteFunction")) then
			return ("bad argument to 'fire_remote' (RemoteEvent or RemoteFunction expected, got %s)"):format(remote.ClassName);
		end;
		if remote:IsA("RemoteEvent") then
			remote:FireServer(...);
		else
			remote:InvokeServer(...);
		end;
	end;
end;

API.stop_animation = function()
    if not stalkie.animation.state.is_playing then return end;
    
	local stopped_url = stalkie.animation.state.current_url

    if stalkie.connections.animation_hb then
        stalkie.connections.animation_hb:Disconnect();
        stalkie.connections.animation_hb = nil;
    end

    local player = get_local_player();
    if typeof(player) == "string" then return player end;

    local clone_char = API.get_clone(player);
    if clone_char then
        for motor, orig_c0 in pairs(stalkie.animation.original_motor_c0s) do
            if motor and motor.Parent then
                motor.C0 = orig_c0;
            end
        end
        local clone_animate_script = clone_char:FindFirstChild("Animate")
        if clone_animate_script then
            clone_animate_script.Disabled = false
        end
    end
    
    clear_table(stalkie.animation.original_motor_c0s);
    clear_table(stalkie.animation.joints);
    stalkie.animation.state = { is_playing = false, current_url = nil, speed = 1.0, keyframes = nil, total_duration = 0, elapsed_time = 0 };

	if stalkie.callbacks.on_stop then
		pcall(stalkie.callbacks.on_stop, stopped_url)
	end
end;

API.reanimate = function(bool, remote, args)
	if bool ~= true and bool ~= false then
		return ("bad argument #1 to 'reanimate' (boolean expected, got %s)"):format(typeof(bool));
	end;
	local player = get_local_player();
	if typeof(player) == "string" then return player end;

	local is_local_event = false;
	if not remote then
		local game_remote, game_args, is_local = get_game_ragdoll_info(bool);
		if game_remote then
			remote = game_remote;
			args = game_args;
			is_local_event = is_local;
		end;
	end;

	if bool then
		if stalkie.flags.reanimated then
			return "Already reanimated.";
		end;
		
		API.stop_animation();
		
		local real_char = get_char(player);
        if typeof(real_char) == "string" then return real_char end;
		if not real_char:FindFirstChild("Humanoid") then
			return "Real character is missing a Humanoid.";
		end;
		local real_hrp = real_char:FindFirstChild("HumanoidRootPart")
		if not real_hrp then
			return "Real character is missing a HumanoidRootPart, cannot reanimate.";
		end
		
		stalkie.real_chars[player] = real_char;
		local cloned_char = clone_char(real_char);
        if typeof(cloned_char) == "string" then return cloned_char end;
		if not cloned_char:FindFirstChild("Humanoid") then
			return "Cloned character failed to create or is missing a Humanoid.";
		end;
		
		stalkie.clones[player] = cloned_char;
		set_model_transparency(cloned_char, 1);
		
		local player_gui = player:FindFirstChildWhichIsA("PlayerGui");
		local gui_states = {};
		if player_gui then
			for _, gui in player_gui:GetChildren() do
				if gui:IsA("ScreenGui") then
					gui_states[gui] = gui.ResetOnSpawn;
					gui.ResetOnSpawn = false;
				end;
			end;
		end;
		
		player.Character = cloned_char;
		
		local animate = cloned_char:FindFirstChild("Animate");
		if animate then
			animate.Disabled = true;
			task.wait();
			animate.Disabled = false;
		end
		
		if player_gui then
			for gui, state in pairs(gui_states) do
				if gui.Parent then
					gui.ResetOnSpawn = state;
				end;
			end;
		end;
		
		stalkie.connections.hb = stalkie.services.run_service.Heartbeat:Connect(function()
			if not real_char or not real_char.Parent or not cloned_char or not cloned_char.Parent then
				API.reanimate(false, remote, args);
				return;
			end;
			for _, p in real_char:GetChildren() do
				local clone_part = cloned_char:FindFirstChild(p.Name);
				if p:IsA("BasePart") and clone_part then
					p.CFrame = clone_part.CFrame;
					p.Velocity = Vector3.new();
					p.RotVelocity = Vector3.new();
				end;
			end;
		end);
		
		local real_humanoid = real_char:FindFirstChild("Humanoid");
		local cloned_humanoid = cloned_char:FindFirstChild("Humanoid");
		
		if real_humanoid then
			stalkie.connections.died = real_humanoid.Died:Connect(function()
				API.reanimate(false, remote, args);
			end);
			stalkie.connections.real_char_child_removed = real_char.ChildRemoved:Connect(function(child)
				if child == real_humanoid or child == real_hrp then
					API.reanimate(false, remote, args);
				end;
			end);
		end
		
		if cloned_humanoid then
			stalkie.connections.clone_char_child_removed = cloned_char.ChildRemoved:Connect(function(child)
				if child == cloned_humanoid then
					API.reanimate(false, remote, args);
				end;
			end);
			stalkie.connections.clone_died = cloned_humanoid.Died:Connect(function()
				local current_real_humanoid = real_char and real_char:FindFirstChild("Humanoid");
				if current_real_humanoid and current_real_humanoid.Health > 0 then
					current_real_humanoid.Health = 0;
				else
					API.reanimate(false, remote, args);
				end;
			end);
		end
		
		stalkie.connections.character_removing = player.CharacterRemoving:Connect(function(character_being_removed)
			if character_being_removed == cloned_char or character_being_removed == real_char then
				API.reanimate(false, remote, args);
			end;
		end);
		
		if remote then
			local err = fire_remote(remote, is_local_event, unpack(args or {}));
            if err then return err end;
		end;
		stalkie.flags.reanimated = true;
	else
		if not stalkie.flags.reanimated then
			return;
		end;
		
        API.stop_animation();
		
		if remote then
			local err = fire_remote(remote, is_local_event, unpack(args or {}));
            if err then return err end;
		end;
		
		for key, connection in pairs(stalkie.connections) do
			if connection then
				connection:Disconnect();
				stalkie.connections[key] = nil;
			end;
		end;
		
		local cloned_char = stalkie.clones[player];
		if cloned_char and cloned_char.Parent then
			cloned_char:Destroy();
			stalkie.clones[player] = nil;
		end;
		
		local real_char = stalkie.real_chars[player];
		if real_char and real_char.Parent then
			set_model_transparency(real_char, 0);
			local hrp = real_char:FindFirstChild("HumanoidRootPart");
			if hrp then
				hrp.Transparency = 1;
			end;
			
			local player_gui = player:FindFirstChildWhichIsA("PlayerGui");
			if player_gui then
				for _, gui in player_gui:GetChildren() do
					if gui:IsA("ScreenGui") then
						gui.ResetOnSpawn = false;
					end;
				end;
			end;
			
			player.Character = real_char;
			
			local real_animate = real_char:FindFirstChild("Animate");
			if real_animate then
				real_animate.Disabled = true;
				task.wait();
				real_animate.Disabled = false;
			end
			
			if player_gui then
				for _, gui in player_gui:GetChildren() do
					if gui:IsA("ScreenGui") then
						gui.ResetOnSpawn = true;
					end;
				end;
			end;
		end;
		stalkie.flags.reanimated = false;
	end;
end;

API.play_animation = function(url, speed)
    if not stalkie.flags.reanimated then
        return "Cannot play animation, not reanimated.";
    end
    
    local player = get_local_player();
    if typeof(player) == "string" then return player end;
    
    local clone_char = API.get_clone(player);
    if not clone_char then 
        return "Cannot play animation, clone character not found.";
    end
    
    if stalkie.animation.state.is_playing and stalkie.animation.state.current_url == url then
        API.stop_animation();
        return;
    end
    
    API.stop_animation();
    
    local clone_anim_controller = clone_char:FindFirstChildOfClass("Humanoid") or clone_char:FindFirstChildOfClass("AnimationController")
    if clone_anim_controller then
        for _, track in ipairs(clone_anim_controller:GetPlayingAnimationTracks()) do
            track:Stop()
        end
    end
    local clone_animate_script = clone_char:FindFirstChild("Animate")
    if clone_animate_script then
        clone_animate_script.Disabled = true
    end
    
    local anim = stalkie.animation;
    anim.state.speed = tonumber(speed) or 1.0;

    local keyframe_data = anim.cache[url];
    if not keyframe_data then
        local success, response = pcall(game.HttpGet, game, url);
		if not success then return "Animation Error: Failed to fetch URL." end

        local loaded_fn, err = loadstring(response);
		if not loaded_fn then return "Animation Error: Invalid script from URL. " .. tostring(err) end;
        
		local success, data = pcall(loaded_fn)
		if not success then return "Animation Error: Script from URL failed to execute. " .. tostring(data) end
        keyframe_data = data;

        if typeof(keyframe_data) ~= "table" then return "Animation Error: Script from URL did not return a table." end;
        
        anim.cache[url] = keyframe_data;
    end

    -- Extract keyframes from KeyframeSequence
    local keyframes = nil;
    if keyframe_data.KeyframeSequence then
        keyframes = keyframe_data.KeyframeSequence;
    else
        for _, value in pairs(keyframe_data) do
            if type(value) == "table" and #value > 0 then
                keyframes = value;
                break;
            end
        end
    end
    
	if not keyframes or #keyframes == 0 then
		return "No keyframes array found for animation URL: " .. url;
	end

    anim.state.keyframes = keyframes;

    clear_table(anim.joints);
    clear_table(anim.original_motor_c0s);
    
    -- Store ALL Motor6D joints
    for _, descendant in ipairs(clone_char:GetDescendants()) do
        if descendant:IsA("Motor6D") then
            -- Use Part1 name as the primary key
            local part1Name = descendant.Part1 and descendant.Part1.Name or "Unknown";
            anim.joints[part1Name] = descendant;
            anim.original_motor_c0s[descendant] = descendant.C0;
            
            -- Also store by Part0 name if it exists and is different
            local part0Name = descendant.Part0 and descendant.Part0.Name or "Unknown";
            if part0Name ~= part1Name and part0Name ~= "Unknown" then
                anim.joints[part0Name] = descendant;
            end
        end
    end

    anim.state.is_playing = true;
    anim.state.current_url = url;
    anim.state.total_duration = keyframes[#keyframes].Time;
	if anim.state.total_duration <= 0 then API.stop_animation(); return end;
	
	anim.state.elapsed_time = 0;
	
	if stalkie.callbacks.on_play then
		pcall(stalkie.callbacks.on_play, anim.state.current_url)
	end
	
	stalkie.connections.animation_hb = stalkie.services.run_service.Heartbeat:Connect(function(deltaTime)
		if not anim.state.is_playing then return end;
		
		anim.state.elapsed_time = anim.state.elapsed_time + (deltaTime * anim.state.speed);
		
		if anim.state.elapsed_time >= anim.state.total_duration then
			anim.state.elapsed_time = anim.state.elapsed_time % anim.state.total_duration;
		end
		
		local current_frame = nil;
		local next_frame = nil;
		
		for i = 1, #anim.state.keyframes - 1 do
			local current_time = anim.state.keyframes[i].Time;
			local next_time = anim.state.keyframes[i + 1].Time;
			
			if anim.state.elapsed_time >= current_time and anim.state.elapsed_time < next_time then
				current_frame = anim.state.keyframes[i];
				next_frame = anim.state.keyframes[i + 1];
				break;
			end
		end
		
		if not current_frame then
			current_frame = anim.state.keyframes[#anim.state.keyframes];
			next_frame = anim.state.keyframes[1];
		end
		
		local alpha = 0;
		if current_frame and next_frame then
			local time_diff = next_frame.Time - current_frame.Time;
			if time_diff > 0 then
				alpha = (anim.state.elapsed_time - current_frame.Time) / time_diff;
			else
				local total_duration = anim.state.total_duration;
				if total_duration > 0 then
					alpha = (anim.state.elapsed_time - current_frame.Time) / (total_duration - current_frame.Time + next_frame.Time);
				end
			end
			alpha = math.clamp(alpha, 0, 1);
		end
		
		if current_frame and current_frame.Data then
			for partName, pose_cframe in pairs(current_frame.Data) do
				local motor = anim.joints[partName];
				if motor and anim.original_motor_c0s[motor] then
					local original_c0 = anim.original_motor_c0s[motor];
					
					if next_frame and next_frame.Data and next_frame.Data[partName] then
						local next_pose = next_frame.Data[partName];
						local interpolated = pose_cframe:Lerp(next_pose, alpha);
						motor.C0 = original_c0 * interpolated;
					else
						motor.C0 = original_c0 * pose_cframe;
					end
				end
			end
		end
	end);
end;

API.set_animation_speed = function(speed)
    stalkie.animation.state.speed = tonumber(speed) or 1.0;
end;

API.on_animation_play = function(callback)
	if type(callback) == "function" then
		stalkie.callbacks.on_play = callback
	end
end

API.on_animation_stop = function(callback)
	if type(callback) == "function" then
		stalkie.callbacks.on_stop = callback
	end
end

API.is_animation_playing = function()
	return stalkie.animation.state.is_playing, stalkie.animation.state.current_url
end

API.is_reanimated = function()
	return stalkie.flags.reanimated;
end;

API.get_clone = function(player)
	player = player or get_local_player();
	if typeof(player) == "string" then return nil end;
	return stalkie.clones[player];
end;

API.get_real_character = function(player)
	player = player or get_local_player();
	if typeof(player) == "string" then return nil end;
	return stalkie.real_chars[player];
end;

-- DEBUG: Add this to check what's happening
API.debug_joints = function()
	local player = get_local_player();
	if typeof(player) == "string" then return player end;
	local clone = API.get_clone(player);
	if not clone then return "No clone found" end;
	
	print("=== MOTOR6D JOINTS IN CLONE ===");
	for _, desc in clone:GetDescendants() do
		if desc:IsA("Motor6D") then
			local p1 = desc.Part1 and desc.Part1.Name or "NONE";
			local p0 = desc.Part0 and desc.Part0.Name or "NONE";
			print("Motor: Part1=" .. p1 .. ", Part0=" .. p0);
		end
	end
	
	print("=== STORED JOINTS ===");
	for name, _ in pairs(stalkie.animation.joints) do
		print("Stored: " .. name);
	end
	
	print("=== KEYFRAME PARTS (first frame) ===");
	if stalkie.animation.keyframes and stalkie.animation.keyframes[1] then
		for name, _ in pairs(stalkie.animation.keyframes[1].Data) do
			print("Keyframe: " .. name);
		end
	end
end

return API;
