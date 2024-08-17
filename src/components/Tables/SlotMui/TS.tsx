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
import { type Slot } from "./makeData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Slot>[]>(
    () => [
      {
        accessorKey: "purposeId",
        header: "Purpose ID",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.purposeId,
          helperText: validationErrors?.purposeId,
          // Remove any previous validation errors when the input is focused
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              purposeId: undefined,
            }),
        },
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        muiEditTextFieldProps: {
          type: "time",
          required: true,
          error: !!validationErrors?.startTime,
          helperText: validationErrors?.startTime,
          // Remove any previous validation errors when the input is focused
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              startTime: undefined,
            }),
        },
      },
      {
        accessorKey: "endTime",
        header: "End Time",
        muiEditTextFieldProps: {
          type: "time",
          required: true,
          error: !!validationErrors?.endTime,
          helperText: validationErrors?.endTime,
          // Remove any previous validation errors when the input is focused
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              endTime: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  );


  //call CREATE hook
  const { mutateAsync: createSlot, isPending: isCreatingSlot } =
    useCreateSlot();
  //call READ hook
  const {
    data: fetchedSlots = [],
    isError: isLoadingSlotsError,
    isFetching: isFetchingSlots,
    isLoading: isLoadingSlots,
  } = useGetSlots();
  //call UPDATE hook
  const { mutateAsync: updateSlot, isPending: isUpdatingSlot } =
    useUpdateSlot();
  //call DELETE hook
  const { mutateAsync: deleteSlot, isPending: isDeletingSlot } =
    useDeleteSlot();

  //CREATE action
  const handleCreateSlot: MRT_TableOptions<Slot>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateSlot(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createSlot(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveSlot: MRT_TableOptions<Slot>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateSlot(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Slot>) => {
    if (window.confirm("Are you sure you want to delete this Slot?")) {
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedSlots,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    muiToolbarAlertBannerProps: isLoadingSlotsError
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
    onCreatingRowSave: handleCreateSlot,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveSlot,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Slot</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Slot</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
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
        Create New Slot
      </Button>
    ),
    state: {
      isLoading: isLoadingSlots,
      isSaving: isCreatingSlot || isUpdatingSlot || isDeletingSlot,
      showAlertBanner: isLoadingSlotsError,
      showProgressBars: isFetchingSlots,
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

//CREATE hook (post new Slot to api)
function useCreateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (Slot: Slot) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newSlotInfo: Slot) => {
      queryClient.setQueryData(
        ["Slots"],
        (prevSlots: any) =>
          [
            ...prevSlots,
            {
              ...newSlotInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Slot[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Slots'] }), //refetch Slots after mutation, disabled for demo
  });
}

//READ hook (get Slots from api)
function useGetSlots() {
  return useQuery<Slot[]>({
    queryKey: ['slots'],
    queryFn: async () => {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      // Make API request with Authorization header
      const response = await fetch('http://localhost:3000/slots', {
        headers: {
          'Authorization': `${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Slots');
      }

      const data = await response.json();
      return data.map((item: any) => ({
        slotId: item.slot_id,
        purposeId: item.purpose_id,
        startTime: item.start_time,
        endTime: item.end_time,
      }));
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put Slot in api)
function useUpdateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Slots'] }), //refetch Slots after mutation, disabled for demo
  });
}

//DELETE hook (delete Slot in api)
function useDeleteSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Slots'] }), //refetch Slots after mutation, disabled for demo
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

function validateSlot(Slot: Slot) {
  return {};
}
