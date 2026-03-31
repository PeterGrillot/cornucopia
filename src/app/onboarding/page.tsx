"use client";
import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useReducer } from "react";

/*
Multi step for

type Care = ['anxiety', 'depression', 'trauma', 'other'] as const

firstName: string
lastName: string
email: string // validate format
care: (typeof Care)[number]
hadCare: boolean
careDescription?: string
provider: string


Step 1 - basic info
last, first name, email

Step 2 - care preference
type of care
- have you attended care befor
if yes, text are, what worked well

Step 3 - insurance provider string
display summary
submit

Reqs: validate each step
keep prev data
log console submit
basic inline errors

*/
const care = ["anxiety", "depression", "trauma", "other"] as const;
type OnBoardingFormData = {
  step: number;
  firstName: string;
  lastName: string;
  email: string; // validate format
  care: (typeof care)[number];
  hadCare: boolean;
  careDescription?: string;
  provider: string;
};

const initialState: OnBoardingFormData = {
  step: 1,
  firstName: "",
  lastName: "",
  email: "", // validate format
  care: "other",
  hadCare: false,
  careDescription: undefined,
  provider: "",
};

type StateAction =
  | { type: "updateForm"; payload: Partial<OnBoardingFormData> }
  | {
      type: "completeStepOne";
      payload: {
        firstName: OnBoardingFormData["firstName"];
        lastName: OnBoardingFormData["lastName"];
        email: OnBoardingFormData["email"];
      };
    }
  | {
      type: "completeStepTwo";
      payload: {
        care: OnBoardingFormData["care"];
        careDescription: OnBoardingFormData["careDescription"];
      };
    }
  | { type: "prevStep" };

const reducer = (
  state: OnBoardingFormData,
  action: StateAction,
): OnBoardingFormData => {
  switch (action.type) {
    case "updateForm":
      return { ...state, ...action.payload };

    case "completeStepOne":
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        step: 2,
      };
    case "completeStepTwo":
      return {
        ...state,
        care: action.payload.care,
        careDescription: action.payload.careDescription,
        step: 3,
      };
    case "prevStep":
      return { ...state, step: state.step - 1 };
    default:
      return state;
  }
};

export function OnboardingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmitStepOne = (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const firstName = event.currentTarget.firstName.value;
    const lastName = event.currentTarget.lastName.value;
    const email = event.currentTarget.email.value;
    dispatch({
      type: "completeStepOne",
      payload: { firstName, lastName, email },
    });
  };

  const handleSubmitStepTwo = (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const care = event.currentTarget.care.value;
    const careDescription = event.currentTarget.careDescription.value;
    dispatch({
      type: "completeStepTwo",
      payload: { care, careDescription },
    });
  };

  const handleSubmitForm = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const provider = event.currentTarget.provider.value;
    dispatch({
      type: "updateForm",
      payload: { provider },
    });
    console.log(state);
  };

  return (
    <>
      {state.step === 1 ? (
        <form
          onSubmit={handleSubmitStepOne}
          className="w-[400px] m-auto p-4 flex gap-4 flex-col"
        >
          <Heading>Basic Information</Heading>
          <TextField.Root
            required
            name="firstName"
            placeholder="First Name"
            defaultValue={state.firstName}
          />
          <TextField.Root
            required
            name="lastName"
            placeholder="Last Name"
            defaultValue={state.lastName}
          />
          <TextField.Root
            required
            name="email"
            type="email"
            placeholder="email"
            defaultValue={state.email}
          />
          <Button type="submit">Next</Button>
        </form>
      ) : null}
      {state.step === 2 ? (
        <form
          onSubmit={handleSubmitStepTwo}
          className="w-[400px] m-auto p-4 flex gap-4 flex-col"
        >
          <Heading>Care Preferences</Heading>
          <Select.Root name="care" defaultValue={state.care}>
            <Select.Trigger />
            <Select.Content>
              {care.map((item) => (
                <Select.Item key={item} value={item}>
                  {item}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Flex align="center" gap="2">
            <Checkbox
              defaultChecked={state.hadCare}
              onClick={() =>
                dispatch({
                  type: "updateForm",
                  payload: {
                    hadCare: !state.hadCare,
                  },
                })
              }
            />
            Have you had Care?
          </Flex>
          {state.hadCare ? (
            <TextArea
              name="careDescription"
              defaultValue={state.careDescription}
            />
          ) : null}

          <Button type="button" onClick={() => dispatch({ type: "prevStep" })}>
            Prev
          </Button>
          <Button type="submit">Next</Button>
        </form>
      ) : null}
      {state.step === 3 ? (
        <form
          onSubmit={handleSubmitForm}
          className="w-[400px] m-auto p-4 flex gap-4 flex-col"
        >
          <Heading>Insurance & Review</Heading>
          <TextField.Root
            required
            name="provider"
            placeholder="Provider"
            defaultValue={state.provider}
          />
          <Button type="button" onClick={() => dispatch({ type: "prevStep" })}>
            Prev
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      ) : null}
    </>
  );
}

export default OnboardingPage;
