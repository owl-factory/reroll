import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { ModuleData } from "controllers/data/ModuleData";
import { RulesetData } from "controllers/data/RulesetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { ModuleDocument } from "types/documents";
import { RulesetOptions } from "../rulesets/Options";

const INITIAL_VALUES = {
  ref: "",
  name: "",
  alias: "",
  "ruleset.ref": null,
};

function onSubmit(values: Partial<ModuleDocument>) {
  try {
    if (values.ref) { ModuleData.update(values); }
    else { ModuleData.create(values); }
  } catch (e) {
    console.error(e);
  }
}

export const ModuleForm = observer((props: any) => {
  // Ensures that the data is pulled in from the database
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
  }, []);

  const initialValues = props.module || INITIAL_VALUES;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<Partial<ModuleDocument>>) => (
        <Form>
          <Input name="name" type="text" label="Name"/>
          <Input name="alias" type="text" label="Alias"/>
          <Select name="ruleset.ref">
            <RulesetOptions parameters={{ group: "data" }}/>
          </Select>
          <Button type="button" onClick={() => formikProps.resetForm}>Reset</Button>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
});
