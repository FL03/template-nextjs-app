/**
 * Created At: 2025.10.23:15:39:39
 * @author - @FL03
 * @directory - tests
 * @file - shift-form.test.tsx
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock current user hook
jest.mock('../src/features/auth', () => ({
  useCurrentUser: () => ({
    profile: { primary_organization: 'org-123' },
    username: 'jdoe',
  }),
  CurrentUserProvider: ({ children }: any) => <>{children}</>,
}));

// Mock the shift utils so saveShiftAction does not run server code at module-eval
jest.mock('../src/features/shifts/utils', () => ({
  saveShiftAction: jest.fn(),
}));

// Mock OrgSelect so tests can inspect the organization input
jest.mock('../src/features/orgs', () => ({
  OrgSelect: ({ name, defaultValue, value }: any) => (
    <input
      data-testid='org-select'
      name={name}
      defaultValue={defaultValue}
      value={value}
    />
  ),
}));

// Mock Calendar to avoid rendering heavy datepicker internals
jest.mock('@/components/ui/calendar', () => ({
  Calendar: (props: any) => <div data-testid='calendar' />,
}));

// Import after mocks
import { ShiftForm } from '../src/features/shifts/widgets/shift-form';

describe('ShiftForm', () => {
  let useActionStateSpy: jest.SpyInstance;

  beforeEach(() => {
    // stub React.useActionState used by the form
    useActionStateSpy = jest
      .spyOn(React as any, 'useActionState')
      .mockReturnValue([{ status: 'init' }, jest.fn(), false]);
  });

  afterEach(() => {
    useActionStateSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('renders date, hidden id and assignee defaults (from useCurrentUser/defaults)', () => {
    const defaultDate = '2025-10-21T12:00:00.000Z';
    render(
      <ShiftForm
        defaultValues={{
          id: 'shift-1',
          date: defaultDate,
          organization_id: 'org-override',
          tips_cash: 42,
        }}
      />,
    );

    // hidden shift id
    const idInput = document.querySelector(
      'input[name="id"]',
    ) as HTMLInputElement;
    expect(idInput).toBeInTheDocument();
    expect(idInput.value).toBe('shift-1');

    // hidden assignee should default to username from mocked useCurrentUser
    const assigneeInput = document.querySelector(
      'input[name="assignee"]',
    ) as HTMLInputElement;
    expect(assigneeInput).toBeInTheDocument();
    expect(assigneeInput.value).toBe('jdoe');

    // date hidden input produced by DateField
    const dateInput = document.querySelector(
      'input[name="date"]',
    ) as HTMLInputElement;
    expect(dateInput).toBeInTheDocument();
    // DateField writes ISO string
    expect(new Date(dateInput.value).toISOString()).toBe(
      new Date(defaultDate).toISOString(),
    );

    // OrgSelect stub should render an input with provided default
    const org = screen.getByTestId('org-select') as HTMLInputElement;
    expect(org).toBeInTheDocument();
    // the component forwarded the defaultValue prop
    expect(org.defaultValue).toBe('org-override');
  });

  it('enables submit/save button when not pending', async () => {
    // Ensure default (not pending) state
    render(<ShiftForm />);

    const saveBtn = await screen.findByTestId('shift-form-submit');
    expect(saveBtn).not.toBeDisabled();
  });
});
