--These locals are made to shorten the script, use replace (ctrl+h) if you don't want to use them
local cn = CFrame.new
local ca = function(x,y,z) return CFrame.Angles(math.rad(x),math.rad(y),math.rad(z)) end

CFrames= {
	[1] = {
		["LeftKnee"]={
			["CFrame"]=cn(0,0,-651.399),
			["TimeLength"]=0,
		},
		["LeftAnkle"]={
			["CFrame"]=cn(-3395.171,0,0),
			["TimeLength"]=0,
		},
		["Waist"]={
			["CFrame"]=cn(-0.021,-0.802,0),
			["TimeLength"]=0,
		},
		["RightShoulder"]={
			["CFrame"]=cn(0,5.609,0),
			["TimeLength"]=0,
		},
		["RightElbow"]={
			["CFrame"]=cn(-733.3,0,0),
			["TimeLength"]=0,
		},
		["RightWrist"]={
			["CFrame"]=cn(737.407,0,0),
			["TimeLength"]=0,
		},
		["Neck"]={
			["CFrame"]=cn(-0,-30.716,0),
			["TimeLength"]=0,
		},
		["LeftShoulder"]={
			["CFrame"]=cn(-5.203,0,0),
			["TimeLength"]=0,
		},
		["LeftWrist"]={
			["CFrame"]=cn(-1095.614,0,0),
			["TimeLength"]=0,
		},
		["RightKnee"]={
			["CFrame"]=cn(698.431,0,0),
			["TimeLength"]=0,
		},
	},
}

return CFrames
