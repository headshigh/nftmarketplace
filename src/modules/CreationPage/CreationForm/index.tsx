import * as Yup from "yup";
type CreationFormProps = {
  onSubmit: (values: CreationValues) => Promise<void>;
};
import { Form, Formik } from "formik";

export const creationValidationSchema = Yup.object().shape({
  name: Yup.string().required("Must enter a name"),
  description: Yup.string().required("Must enter a description"),
  image: Yup.mixed().test("is_defined", "Must select an image", (value) =>
    Boolean(value)
  ),
});
const CreationForm = ({ onSubmit }: CreationFormProps) => {};
