extends Node



func _on_quit_pressed() -> void:
	get_tree().quit()


func _on_play_pressed() -> void:
	$VBoxContainer.visible = false
	$VBoxContainer2.visible = true
	


func _on_back_pressed() -> void:
	$VBoxContainer2.visible = false
	$VBoxContainer.visible = true
	
