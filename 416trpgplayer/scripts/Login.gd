extends Control

@onready var http = HTTPRequest.new()

func _on_exit_pressed() -> void:
	get_tree().quit()

func _ready():
	add_child(http)
	http.connect("request_completed", Callable(self, "_on_request_completed"))

func _on_request_completed(result, _response_code, _headers, body):
	var json_result = JSON.parse_string(body.get_string_from_utf8())
	

	if result != http.RESULT_SUCCESS:
		print("Something went wrong in \"on_request_completed(result, response_code, headers, body):\'")
		return

	if json_result.has("success") and json_result["success"] == true:
		Globals.username = $VBoxContainer/MarginContainer3/UsernameLineEdit.text
		get_tree().change_scene_to_file("res://scenes/MainMenu.tscn")
	else:
		$VBoxContainer/MarginContainer5/VBoxContainer/IncorrectWarning.visible = true
		await get_tree().create_timer(3.0).timeout
		$VBoxContainer/MarginContainer5/VBoxContainer/IncorrectWarning.visible = false


func _on_login_button_pressed() -> void:
	var username = $VBoxContainer/MarginContainer3/UsernameLineEdit.text
	var password = $VBoxContainer/MarginContainer4/PasswordLineEdit.text
	
	if password == "" || username == "":
		var button = $VBoxContainer/MarginContainer5/VBoxContainer/LoginButton
		button.disabled = true
		$VBoxContainer/MarginContainer5/VBoxContainer/BlankWarning.visible = true
		await get_tree().create_timer(3.0).timeout
		$VBoxContainer/MarginContainer5/VBoxContainer/BlankWarning.visible = false
		button.disabled = false
	else:
		var data = {
			"username": username,
			"password": password
		}
		var json = JSON.stringify(data)
		
		# Make the POST request
		var headers = ["Content-Type: application/json"]
		
		var err = http.request(
			Config.backend_url + "api/login",
			headers,
			HTTPClient.METHOD_POST,
			json
		)
		
		if err != OK:
			print("Request failed:", err)
			


func _on_password_line_edit_text_submitted(_new_text: String) -> void:
	$VBoxContainer/MarginContainer5/VBoxContainer/LoginButton.emit_signal("pressed")


func _on_username_line_edit_text_submitted(_new_text: String) -> void:
	$VBoxContainer/MarginContainer5/VBoxContainer/LoginButton.emit_signal("pressed")
	
func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept"):  # Enter/Return is bound to "ui_accept" by default
		_on_login_button_pressed()
