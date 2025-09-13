extends Node2D

@onready var video = $VideoStreamPlayer


func _on_video_stream_player_finished() -> void:
	# when video ends, switch to main menu
	get_tree().change_scene_to_file("res://scenes/Login.tscn")
