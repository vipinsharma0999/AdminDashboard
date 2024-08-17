"use client";
import { useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { type Account } from "./makeData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField } from "@mui/material";

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Account>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: "contact",
        header: "Contact",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.contact,
          helperText: validationErrors?.contact,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              contact: undefined,
            }),
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createAccount, isPending: isCreatingAccount } =
    useCreateAccount();
  //call READ hook
  const {
    data: fetchedAccounts = [],
    isError: isLoadingAccountsError,
    isFetching: isFetchingAccounts,
    isLoading: isLoadingAccounts,
  } = useGetAccounts();
  //call UPDATE hook
  const { mutateAsync: updateAccount, isPending: isUpdatingAccount } =
    useUpdateAccount();
  //call DELETE hook
  const { mutateAsync: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();

  //CREATE action
  const handleCreateAccount: MRT_TableOptions<Account>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    console.log(values);
    const newValidationErrors = validateAccount(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    try {
      await createAccount(values);
      table.setCreatingRow(null); // Exit creating mode
    } catch (error) {
      console.error('Failed to create account:', error);
      // Handle the error (e.g., show a notification)
    }
  };

  //UPDATE action
  const handleSaveAccount: MRT_TableOptions<Account>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateAccount(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateAccount(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Account>) => {
    if (window.confirm("Are you sure you want to delete this Account?")) {
      deleteAccount(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedAccounts,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingAccountsError
      ? {
        color: "error",
        children: "Error loading data",
        position: "bottom", // Position alert banner at the bottom
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateAccount,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveAccount,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Account</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.firstName}
            helperText={validationErrors?.firstName}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              firstName: undefined
            })}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.lastName}
            helperText={validationErrors?.lastName}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              lastName: undefined
            })}
          />
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.contact}
            helperText={validationErrors?.contact}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              contact: undefined
            })}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.password}
            helperText={validationErrors?.password}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              password: undefined
            })}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.confirmPassword}
            helperText={validationErrors?.confirmPassword}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              confirmPassword: undefined
            })}
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Account</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.firstName}
            helperText={validationErrors?.firstName}
            defaultValue={row.original.firstName}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              firstName: undefined
            })}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.lastName}
            helperText={validationErrors?.lastName}
            defaultValue={row.original.lastName}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              lastName: undefined
            })}
          />
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.contact}
            helperText={validationErrors?.contact}
            defaultValue={row.original.contact}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              contact: undefined
            })}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.password}
            helperText={validationErrors?.password}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              password: undefined
            })}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            error={!!validationErrors?.confirmPassword}
            helperText={validationErrors?.confirmPassword}
            onChange={(e) => setValidationErrors({
              ...validationErrors,
              confirmPassword: undefined
            })}
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); // Open the create row modal
        }}
      >
        Create New Account
      </Button>
    ),
    state: {
      isLoading: isLoadingAccounts,
      isSaving: isCreatingAccount || isUpdatingAccount || isDeletingAccount,
      showAlertBanner: isLoadingAccountsError,
      showProgressBars: isFetchingAccounts,
    },
    paginationDisplayMode: "pages", // Use page-based pagination
    positionToolbarAlertBanner: "bottom", // Position alert banner at the bottom
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined", // Customize search text field
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30], // Options for rows per page
      shape: "rounded",
      variant: "outlined", // Customize pagination component
    },
    enableFullScreenToggle: false, // Disable full-screen toggle option
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new Account to api)
function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAccount: Account) => {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(newAccount),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      return response.json(); // Return the response from the API
    },
    // Client-side optimistic update
    onMutate: (newAccountInfo: Account) => {
      queryClient.setQueryData(
        ['Accounts'],
        (prevAccounts: Account[] | undefined) =>
          prevAccounts
            ? [
              ...prevAccounts,
              {
                ...newAccountInfo,
                id: (Math.random() + 1).toString(36).substring(7),
              },
            ]
            : [newAccountInfo]
      );
    },
    // Optionally refetch accounts after mutation
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Accounts'] }),
  });
}


//READ hook (get Accounts from api)
function useGetAccounts() {
  return useQuery<Account[]>({
    queryKey: ['Accounts'],
    queryFn: async () => {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      // Make API request with Authorization header
      const response = await fetch('http://localhost:3000/users/allaccounts', {
        headers: {
          'Authorization': `${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Accounts');
      }

      const data = await response.json();
      return data.map((Account: any) => ({
        id: Account.Account_id, // Map Account_id to id for consistency
        firstName: Account.first_name,
        lastName: Account.last_name,
        email: Account.email,
        contact: Account.contact,
        address: Account.address,
        panCard: Account.pan_card,
        isVerified: Account.is_verified,
        roleId: Account.role_id,
      }));
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put Account in api)
function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (Account: Account) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newAccountInfo: Account) => {
      queryClient.setQueryData(["Accounts"], (prevAccounts: any) =>
        prevAccounts?.map((prevAccount: Account) =>
          prevAccount.id === newAccountInfo.id ? newAccountInfo : prevAccount,
        ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Accounts'] }), //refetch Accounts after mutation, disabled for demo
  });
}

//DELETE hook (delete Account in api)
function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (AccountId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (AccountId: string) => {
      queryClient.setQueryData(["Accounts"], (prevAccounts: any) =>
        prevAccounts?.filter((Account: Account) => Account.id !== AccountId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Accounts'] }), //refetch Accounts after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateAccount(Account: Account & { password?: string; confirmPassword?: string }) {
  const errors: Record<string, string | undefined> = {
    firstName: !validateRequired(Account.firstName) ? "First Name is Required" : "",
    lastName: !validateRequired(Account.lastName) ? "Last Name is Required" : "",
    email: !validateEmail(Account.email) ? "Incorrect Email Format" : "",
    password: !validateRequired(Account.password || "") ? "Password is Required" : "",
    confirmPassword: Account.password !== Account.confirmPassword ? "Passwords do not match" : "",
  };

  return errors;
}
