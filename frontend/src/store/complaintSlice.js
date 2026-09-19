import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    complaint_source: 'Awaiting AI extraction...',
    customer_name: 'Awaiting AI extraction...',
    product_name: 'Awaiting AI extraction...',
    product_strength_grade: 'Awaiting AI extraction...',
    batch_lot_number: 'Awaiting AI extraction...',
    manufacturing_date: 'Awaiting AI extraction...',
    expiry_date: 'Awaiting AI extraction...',
    quantity_affected: 'Awaiting AI extraction...',
    complaint_type: 'Awaiting AI extraction...',
    complaint_date: 'Awaiting AI extraction...',
    detailed_complaint_description: 'Awaiting AI extraction...',
    initial_severity: 'Awaiting AI extraction...',
    priority: 'Awaiting AI extraction...'
  },
  status: 'idle', // idle, loading, success
  progress: 0
};

export const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    startExtraction: (state) => {
      state.status = 'loading';
      state.progress = 10;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    setExtractedData: (state, action) => {
      state.data = action.payload;
      state.status = 'success';
      state.progress = 100;
    },
    resetForm: () => initialState
  }
});

export const { startExtraction, updateProgress, setExtractedData, resetForm } = complaintSlice.actions;
export default complaintSlice.reducer;