import { useState } from 'react';

import { Eye, EyeOff } from '@/constants/icons';
import { TextField, type TextFieldProps } from './TextField';

export type PasswordFieldProps = Omit<
  TextFieldProps,
  'secureTextEntry' | 'trailingIcon' | 'onTrailingIconPress' | 'trailingIconLabel'
>;

/** TextField with a show/hide toggle. */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      secureTextEntry={!visible}
      trailingIcon={visible ? EyeOff : Eye}
      trailingIconLabel={visible ? 'Hide password' : 'Show password'}
      onTrailingIconPress={() => setVisible((v) => !v)}
    />
  );
}
