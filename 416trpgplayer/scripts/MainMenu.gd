extends Node

func _on_quit_pressed() -> void:
	get_tree().quit()

func _on_play_pressed() -> void:
	$PanelContainer.visible = false
	$VBoxContainer2.visible = true

func _on_back_pressed() -> void:
	$VBoxContainer2.visible = false
	$PanelContainer.visible = true

func _on_create_world_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/CreateWorldPrompt.tscn")
