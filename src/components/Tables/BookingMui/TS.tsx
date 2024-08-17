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
import { type BookingDetail } from "./makeData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { NotificationManager } from "react-notifications";

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<BookingDetail>[]>(
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
      {
        accessorKey: "bookingTime",
        header: "Booking Time",
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(), // Format date/time
      },
      {
        accessorKey: "slotTime",
        header: "Slot Time",
        size: 100,
      },
      {
        accessorKey: "address",
        header: "Address",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.address,
          helperText: validationErrors?.address,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              address: undefined,
            }),
        },
      },
      {
        accessorKey: "panCard",
        header: "PAN Card",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.panCard,
          helperText: validationErrors?.panCard,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              panCard: undefined,
            }),
        },
      },
      {
        accessorKey: "isCompleted",
        header: "Completed",
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: cell.getValue<number>() === 1 ? theme.palette.success.main : theme.palette.error.main,
              borderRadius: "0.25rem",
              color: "#fff",
              p: "0.25rem",
            })}
          >
            {cell.getValue<number>() === 1 ? "Yes" : "No"}
          </Box>
        ),
      },
      {
        accessorKey: "completionTime",
        header: "Completion Time",
        Cell: ({ cell }) => cell.getValue<string | null>() ? new Date(cell.getValue<string>()).toLocaleString() : "N/A",
      },
      {
        accessorKey: "transactionId",
        header: "Transaction ID",
        size: 150,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        Cell: ({ cell }) => cell.getValue<number>()?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
      },
      {
        accessorKey: "donationTime",
        header: "Donation Time",
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(), // Format date/time
      },
      {
        accessorKey: "referralname",
        header: "Referral Name",
        size: 150,
      },
      {
        accessorKey: "referralcontact",
        header: "Referral Contact",
        size: 150,
      },
      {
        accessorKey: "completeAction", // This is a dummy accessor, not mapped to actual data
        header: "Complete Action",
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleCompleteBooking(row.original.bookingId)}
            disabled={row.original.isCompleted === 1} // Disable if already completed
          >
            Complete
          </Button>
        ),
        size: 150,
      },
    ],
    [validationErrors],
  );



  //call CREATE hook
  const { mutateAsync: createBookingDetail, isPending: isCreatingBookingDetail } =
    useCreateBookingDetail();
  //call READ hook
  const {
    data: fetchedBookingDetails = [],
    isError: isLoadingBookingDetailsError,
    isFetching: isFetchingBookingDetails,
    isLoading: isLoadingBookingDetails,
  } = useGetBookingDetails();
  //call UPDATE hook
  const { mutateAsync: updateBookingDetail, isPending: isUpdatingBookingDetail } =
    useUpdateBookingDetail();
  //call DELETE hook
  const { mutateAsync: deleteBookingDetail, isPending: isDeletingBookingDetail } =
    useDeleteBookingDetail();

  //CREATE action
  const handleCreateBookingDetail: MRT_TableOptions<BookingDetail>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateBookingDetail(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createBookingDetail(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveBookingDetail: MRT_TableOptions<BookingDetail>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateBookingDetail(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateBookingDetail(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<BookingDetail>) => {
    if (window.confirm("Are you sure you want to delete this BookingDetail?")) {
      deleteBookingDetail(row.original.bookingId);
    }
  };

  // Define the function to handle the "Complete" button click
  const handleCompleteBooking = async (bookingId: string) => {
    try {
      // Call the API to mark the booking as complete
      await completeBookingApiCall(bookingId);

      // Optionally, refetch the data or update the table locally
      queryClient.invalidateQueries({ queryKey: ['Bookings'] });
    } catch (error) {
      console.error("Failed to complete booking:", error);
    }
  };

  // API call function to mark the booking as complete
  const completeBookingApiCall = async (bookingId: string) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:3000/bookings/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to complete booking');
    }
    else {
      NotificationManager.success("Booking completed successful!", "Success", 3000);

      // Invalidate and refetch the data
      queryClient.invalidateQueries({ queryKey: ['Bookings'] });
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedBookingDetails,
    enableEditing: false,
    getRowId: (row) => row.bookingId,
    muiToolbarAlertBannerProps: isLoadingBookingDetailsError
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
    onCreatingRowSave: handleCreateBookingDetail,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBookingDetail,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New BookingDetail</DialogTitle>
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
        <DialogTitle variant="h3">Edit BookingDetail</DialogTitle>
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
    state: {
      isLoading: isLoadingBookingDetails,
      isSaving: isCreatingBookingDetail || isUpdatingBookingDetail || isDeletingBookingDetail,
      showAlertBanner: isLoadingBookingDetailsError,
      showProgressBars: isFetchingBookingDetails,
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

//CREATE hook (post new BookingDetail to api)
function useCreateBookingDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (BookingDetail: BookingDetail) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newBookingDetailInfo: BookingDetail) => {
      queryClient.setQueryData(
        ["BookingDetails"],
        (prevBookingDetails: any) =>
          [
            ...prevBookingDetails,
            {
              ...newBookingDetailInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as BookingDetail[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['BookingDetails'] }), //refetch BookingDetails after mutation, disabled for demo
  });
}

//READ hook (get BookingDetails from api)
function useGetBookingDetails() {
  return useQuery<BookingDetail[]>({
    queryKey: ['Bookings'],
    queryFn: async () => {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      // Make API request with Authorization header
      const response = await fetch('http://localhost:3000/bookings', {
        headers: {
          'Authorization': `${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Bookings');
      }

      const data = await response.json();
      return data.map((item: any) => ({
        bookingId: item.booking_id,
        donationId: item.donation_id,
        userId: item.user_id,
        slotTime: item.slot_time,
        bookingTime: item.booking_time,
        isCompleted: item.is_completed,
        completionTime: item.completion_time,
        transactionId: item.transaction_id,
        amount: item.amount,
        donationTime: item.donation_time,
        purposeId: item.purpose_id,
        firstName: item.first_name,
        lastName: item.last_name,
        contact: item.contact,
        referralname: item.referral_name,
        referralcontact: item.referral_contact,
      }));
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put BookingDetail in api)
function useUpdateBookingDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (BookingDetail: BookingDetail) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newBookingDetailInfo: BookingDetail) => {
      queryClient.setQueryData(["BookingDetails"], (prevBookingDetails: any) =>
        prevBookingDetails?.map((prevBookingDetail: BookingDetail) =>
          prevBookingDetail.bookingId === newBookingDetailInfo.bookingId ? newBookingDetailInfo : prevBookingDetail,
        ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['BookingDetails'] }), //refetch BookingDetails after mutation, disabled for demo
  });
}

//DELETE hook (delete BookingDetail in api)
function useDeleteBookingDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (BookingDetailId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (BookingDetailId: string) => {
      queryClient.setQueryData(["BookingDetails"], (prevBookingDetails: any) =>
        prevBookingDetails?.filter((BookingDetail: BookingDetail) => BookingDetail.bookingId !== BookingDetailId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['BookingDetails'] }), //refetch BookingDetails after mutation, disabled for demo
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

function validateBookingDetail(BookingDetail: BookingDetail) {
  return {
    firstName: !validateRequired(BookingDetail.firstName)
      ? "First Name is Required"
      : "",
    lastName: !validateRequired(BookingDetail.lastName) ? "Last Name is Required" : "",
    email: !validateEmail(BookingDetail.userId) ? "Incorrect Email Format" : "",
  };
}
