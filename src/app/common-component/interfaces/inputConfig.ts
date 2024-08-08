export interface InputConfig {
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  title?: string;
  value?: any;
  button: {
    buttonLabel: string;
    buttonStyle: string;
  },
  buttonStepper?: boolean,
  onSelectChange?: (...par: any) => void,
  required: boolean,
  funUpload: any,
  max?: string;
  min?: string;
  maxlength?: number;
  minlength?: number;
  options?: any[];
  rows?: string;
  optionsValues?: any[];
  validations?: any[];
}
