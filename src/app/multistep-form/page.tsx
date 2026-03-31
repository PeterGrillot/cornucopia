"use client";
import { Button, Flex, Heading, Select, TextField } from "@radix-ui/themes";
import { useReducer, useState } from "react";

const fields = ["text", "email", "select"] as const;
type FieldType = (typeof fields)[number];

type FieldConfig = {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  dependsOn?: {
    field: string;
    value: string;
  };
};

type StepConfig = {
  id: string;
  title: string;
  enabled: boolean;
  fields: FieldConfig[];
};

const onboardingConfig: StepConfig[] = [
  {
    id: "basic",
    title: "Basic Info",
    enabled: true,
    fields: [
      {
        id: "f1",
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
      },
      {
        id: "f2",
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
    ],
  },
  {
    id: "care",
    title: "Care Preferences",
    enabled: true,
    fields: [
      {
        id: "f3",
        name: "concern",
        label: "Primary Concern",
        type: "select",
        options: ["Anxiety", "Depression", "Trauma"],
      },
      {
        id: "f4",
        name: "explain",
        label: "Please explain",
        type: "text",
        dependsOn: {
          field: "concern",
          value: "Trauma",
        },
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    enabled: false,
    fields: [
      { id: "f5", name: "provider", label: "Insurance Provider", type: "text" },
    ],
  },
];
type FormState = Record<string, string>;

type FormStateAction = { type: "updateForm"; payload: Record<string, string> };

const reducer = (state: FormState, action: FormStateAction): FormState => {
  switch (action.type) {
    case "updateForm":
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const initialState = onboardingConfig
  .flatMap((config) => config.fields)
  .reduce(
    (acc, name) => {
      acc[name.name] = ""; // Update value
      return acc;
    },
    {} as Record<string, string>,
  );

function FormBuilder({
  fieldState,
  onChange,
  stepConfig,
}: {
  fieldState: Record<string, string>;
  onChange: (payload: Record<string, string>) => void;
  stepConfig: StepConfig;
}) {
  return (
    <div className="flex gap-2 flex-col">
      {stepConfig.fields.map((field) => {
        if (field.type === "text" || field.type === "email") {
          if (field.dependsOn) {
            if (fieldState[field.dependsOn.field] === field.dependsOn.value) {
              return (
                <TextField.Root
                  name={field.name}
                  key={field.id}
                  value={fieldState[field.name]}
                  placeholder={field.label}
                  onChange={(e) =>
                    onChange({ [field.name]: e.currentTarget.value })
                  }
                />
              );
            } else {
              return null;
            }
          }
          return (
            <TextField.Root
              name={field.name}
              key={field.id}
              value={fieldState[field.name]}
              placeholder={field.label}
              onChange={(e) =>
                onChange({ [field.name]: e.currentTarget.value })
              }
            />
          );
        }
        if (field.type === "select") {
          return (
            <Select.Root
              key={field.name}
              value={fieldState[field.name]}
              onValueChange={(value) => onChange({ [field.name]: value })}
            >
              <Select.Trigger placeholder="Select one..." />
              <Select.Content>
                {field.options?.map((option) => (
                  <Select.Item key={option} value={option}>
                    {option}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          );
        } else {
          return <>Unknown Field Type</>;
        }
      })}
    </div>
  );
}

export function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);

  const decrementStep = () =>
    setStep((prev) => {
      if (prev - 1 >= 0 && !!onboardingConfig[prev - 1].enabled) {
        return Math.max(prev - 1, 0);
      }
      return prev;
    });

  const incrementStep = () =>
    setStep((prev) => {
      if (!!onboardingConfig[prev + 1].enabled) {
        return Math.min(prev + 1, onboardingConfig.length - 1);
      }
      return prev;
    });

  const handleUpdateForm = (payload: Record<string, string>) =>
    dispatch({ type: "updateForm", payload });
  return (
    <div className="p-4 w-[400px] m-auto">
      <Heading>{onboardingConfig[step].title}</Heading>
      <div className="flex gap-2 flex-col">
        <FormBuilder
          onChange={handleUpdateForm}
          stepConfig={onboardingConfig[step]}
          fieldState={state}
        />
        <div className="flex gap-2">
          <Button onClick={decrementStep}>Prev Step</Button>
          <Button onClick={incrementStep}>Next Step</Button>
        </div>
      </div>
    </div>
  );
}

export default MultiStepForm;
