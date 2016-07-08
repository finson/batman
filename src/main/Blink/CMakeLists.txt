message(STATUS "Executing " ${CMAKE_CURRENT_LIST_FILE})

# Define the port for uploading code to the Arduino
set(${PROJECT_NAME}_PORT COM47)

# Command to generate code arduino firmware (.hex file)
generate_arduino_firmware(${PROJECT_NAME} SKETCH blink.ino)
