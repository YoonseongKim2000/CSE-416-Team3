extends Control

func _on_back_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/MainMenu.tscn")
	

func _on_create_pressed() -> void:
	var WorldName = $VBoxContainer/MarginContainer/VBoxContainer/WorldNameLineEdit.text.strip_edges()
	var MaxPlayers = int($VBoxContainer/MarginContainer2/VBoxContainer/PlayerSet.value)
	
	if WorldName == "":
		print("World name cannot be empty")
		return

	var base_dir = "user://worlds"  # folder to store all worlds
	var dir = DirAccess.open(base_dir)
	
	if not dir:
		var dir_root = DirAccess.open("user://")
		var err = dir_root.make_dir("worlds")
		if err != OK:
			print("Failed to create base worlds folder:", err)
			return
		dir = DirAccess.open(base_dir) # basically reloading with new thingy

	var world_dir = "user://worlds" + "/" + WorldName
	var dir_check = DirAccess.open(world_dir)
	if dir_check:
		print("World with that name already exists")
		return
		
	var err = dir.make_dir(WorldName)
	if err != OK:
		print("Failed to create base worlds folder:", err)
		return
	
	var folders = ["images", "gamestate", "data"]
	var imagesFolders = ["map", "character", "npc", "enemy", "item", "equipment"]
	for item in folders:
		var errLoop = dir.make_dir(WorldName + "/" + item)
		if errLoop != OK:
			print("Failed to create " + item + " folder:", err)
			return
	
	for item in imagesFolders:
		var errLoop = dir.make_dir(WorldName + "/images/" + item)
		if errLoop != OK:
			print("Failed to create " + item + " folder:", err)
			return
		
	return
