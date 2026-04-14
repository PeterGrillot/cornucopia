"use client";
import { Button, Checkbox, Flex, Heading, Select, TextField } from "@radix-ui/themes";
import { useReducer, useState } from "react";

const fields = ["text", "email", "select", "toggleStep"] as const;
type FieldType = (typeof fields)[number];

type FieldConfig = {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  enabledStep?: string;
  checked?: false;
  dependsOn?: {
    field: string;
    value: string;
  };
};

type StepConfig = {
  id: string;
  title: string;
  enabled?: boolean;
  fields: FieldConfig[];
};

const onboardingConfig: StepConfig[] = [
  {
    id: "basic",
    title: "Basic Info",
    enabled: true,
    fields: [
      {
        id: "f1ghfghf564",
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
      },
      {
        id: "f2ghfdrtykl",
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
        id: "f3765yut456",
        name: "concern",
        label: "Primary Concern",
        type: "select",
        options: ["Anxiety", "Depression", "Trauma"],
      },
      {
        id: "fgh786yjfgh",
        name: "explain",
        label: "Please explain",
        type: "text",
        dependsOn: {
          field: "concern",
          value: "Trauma",
        },
      },
      {
        id: "f6ghfd667ytuhgj",
        name: "confirm",
        label: "Please check to continue",
        type: "toggleStep",
        enabledStep: "insurance",
        checked: false,
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    fields: [
      {
        id: "456567rtyghf",
        name: "provider",
        label: "Insurance Provider",
        type: "text",
      },
    ],
  },
];
type FormState = Record<string, string | boolean | number | undefined>;
type EnabledSteps = Record<string, boolean>;

type FormStateAction = { type: "updateForm"; payload: FormState };

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
  .reduce((acc, name) => {
    if (name.enabledStep) acc[name.id] = name.checked ?? false;
    else acc[name.id] = ""; // Update value
    return acc;
  }, {} as FormState);

const enabledStepState = onboardingConfig
  .filter((config) => config.enabled)
  .reduce(
    (acc, name) => {
      acc[name.id] = name.enabled ?? false; // Update value
      return acc;
    },
    {} as Record<string, boolean>
  );

function FormBuilder({
  fieldState,
  onChange,
  stepConfig,
  toggleStep,
}: {
  fieldState: FormState;
  onChange: (payload: FormState) => void;
  toggleStep: ({ id, enabled }: { id: string; enabled: boolean }) => void;
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
                  value={`${fieldState[field.id]}`}
                  placeholder={field.label}
                  onChange={(e) => onChange({ [field.id]: e.currentTarget.value })}
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
              value={`${fieldState[field.id]}`}
              placeholder={field.label}
              onChange={(e) => onChange({ [field.id]: e.currentTarget.value })}
            />
          );
        }
        if (field.type === "toggleStep") {
          const handleToggleStep = () => {
            if (field.enabledStep) {
              toggleStep({ id: field.enabledStep, enabled: true });
              onChange({ [field.id]: true });
            }
          };
          return (
            <Flex key={field.id}>
              <Checkbox
                name={field.name}
                onCheckedChange={handleToggleStep}
                checked={fieldState[field.id] as boolean}
                id={field.id}
              />
              <label htmlFor={field.id}>
                {field.id} {fieldState[field.id] ? "ok" : "no"}
              </label>
            </Flex>
          );
        }
        if (field.type === "select") {
          return (
            <Select.Root
              key={field.name}
              value={`${fieldState[field.name]}`}
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
  const [enabledStep, setEnabledSteps] = useState<EnabledSteps>(enabledStepState);
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
      if (!!onboardingConfig[prev + 1]) {
        const nextStepId = onboardingConfig[prev + 1].id;
        if (!!nextStepId && enabledStep[nextStepId]) {
          return Math.min(prev + 1, onboardingConfig.length - 1);
        }
        return prev;
      }
      return prev;
    });

  const handleUpdateForm = (payload: FormState) => dispatch({ type: "updateForm", payload });

  const handleToggleStep = ({ id, enabled }: { id: string; enabled: boolean }) => {
    setEnabledSteps((prev) => {
      console.log("check", { ...prev, [id]: enabled });
      return { ...prev, [id]: enabled };
    });
  };
  return (
    <div className="p-4 w-[400px] m-auto">
      <Heading>{onboardingConfig[step].title}</Heading>
      <div className="flex gap-2 flex-col">
        <FormBuilder
          onChange={handleUpdateForm}
          toggleStep={handleToggleStep}
          stepConfig={onboardingConfig[step]}
          fieldState={state}
        />
        <div className="flex gap-2">
          {step !== 0 ? <Button onClick={decrementStep}>Prev Step</Button> : null}
          {step !== onboardingConfig.length - 1 ? (
            <Button onClick={incrementStep}>Next Step</Button>
          ) : null}
        </div>
      </div>
      <pre className="bg-gray-200 p-2 border-2 border-gray-400 my-2">
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </div>
  );
}

export default MultiStepForm;
