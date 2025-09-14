import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle
} from 'react-native';

interface InputTextProps extends TextInputProps {
  error?: string;
  containerStyle?: ViewStyle;
}

const InputText: React.FC<InputTextProps> = ({
  error,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          props.style
        ]}
        placeholderTextColor="#666"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'DMRegular',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF4B4B',
    borderWidth: 1,
  },
});

export default InputText;