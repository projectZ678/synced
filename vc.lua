local identifyexecutorname = (identifyexecutor and identifyexecutor()) or "Unknown"
local clonereference = cloneref or function(...) return ... end
local clonefunction = clonefunction or function(...) return ... end

local voicechatservice = clonereference(game:GetService("VoiceChatService"))
local voicechatinternal = clonereference(game:GetService("VoiceChatInternal"))
local coregui = game:GetService("CoreGui")
local startergui = game:GetService("StarterGui")
local players = game:GetService("Players")
local localplayer = players.LocalPlayer
local getconnectionsfunc = clonefunction(getconnections)

local mutedimage = "rbxasset://textures/ui/VoiceChat/MicLight/Muted.png"
local ismuted = true
local hiddenfolder = Instance.new("Folder", game:GetService("RobloxReplicatedStorage"))

local topbarapp = coregui:WaitForChild("TopBarApp", 15):WaitForChild("TopBarApp", 15)
local unibarleft = topbarapp:WaitForChild("UnibarLeftFrame", 15)
local unibarmenu = unibarleft:WaitForChild("UnibarMenu", 15) or unibarleft:WaitForChild("ChromeMenu", 15)
local unibarcontainer

pcall(function()
    unibarcontainer = unibarmenu:WaitForChild("2", 15):WaitForChild("3", 15)
end)

local micmutebutton = unibarcontainer and unibarcontainer:FindFirstChild("toggle_mic_mute", true)

local function geticonlabel(button)
    button = button or micmutebutton
    return button:WaitForChild("IntegrationIconFrame", 15):WaitForChild("IntegrationIcon", 15)["1"]
end

local function setmutestate(state)
    local audiodereviceinput = localplayer:FindFirstChildWhichIsA("AudioDeviceInput", true)
    if audiodereviceinput then
        audiodereviceinput.Active = not state
    else
        voicechatinternal:PublishPause(state)
    end
end

if not micmutebutton then 
    voicechatservice:joinVoice() 
    pcall(function()
        unibarcontainer = unibarmenu:WaitForChild("2", 15):WaitForChild("3", 15)
        micmutebutton = unibarcontainer:WaitForChild("toggle_mic_mute", 15)
    end)
end

if not micmutebutton then return print("Mic button not found - UI path changed.") end

startergui:SetCore("SendNotification", {Title = "mask say hiii", Text = "Unmute to continue.", Duration = 5})

repeat task.wait(2) until geticonlabel().Image ~= mutedimage

voicechatservice:leaveVoice()
task.wait(2)

local connections = getconnectionsfunc(voicechatinternal.StateChanged)
for i = 7, #connections do 
    if connections[i] then connections[i]:Disable() end
end

task.wait(2)
voicechatservice:joinVoice()

pcall(function()
    unibarcontainer = unibarmenu:WaitForChild("2", 15):WaitForChild("3", 15)
    micmutebutton = unibarcontainer:WaitForChild("toggle_mic_mute", 15)
end)

if micmutebutton and unibarcontainer then
    local clonedmutebutton = micmutebutton:Clone()
    micmutebutton.Parent = hiddenfolder
    clonedmutebutton.Name = "toggle_mic_mute_new"
    clonedmutebutton.Parent = unibarcontainer

    local clonedicon = geticonlabel(clonedmutebutton)
    local originalicon = geticonlabel(micmutebutton)

    setmutestate(true)
    clonedmutebutton:WaitForChild("IconHitArea_toggle_mic_mute", 15).Activated:Connect(function()
        ismuted = not ismuted
        setmutestate(ismuted)
        if ismuted then
            clonedicon.Image = mutedimage
        else
            clonedicon.Image = originalicon.Image
        end
    end)
end
