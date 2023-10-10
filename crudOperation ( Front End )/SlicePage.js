import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const AddData = createAsyncThunk('AddData', async (body) => {
  let res = await fetch("http://localhost:3002/crudOpert/AddTask", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }

  })
  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message);
  }

  return response;
})


export const updatetask = createAsyncThunk('crudOpert/:id', async ({ id, data }) => {
  const response = await fetch(`http://localhost:3002/crudOpert/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  const updatedTask = await response.json();
  return updatedTask; // Return the updated task data
});





export const deleteTask = createAsyncThunk('DeleteTask/:id', async (taskId) => {
  
    const response = await fetch(`http://localhost:3002/crudOpert/DeleteTask/${taskId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data; // Return the deleted task ID if successful
    
});

const initialState = {
  data: [],
  status: 'idle',
  isLoading: false,
  isError:true,
  error: null,
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddData.pending, (state) => {
        state.result = true;
      })

      .addCase(AddData.fulfilled, (state, action) => {
        state.result = false;
        state.token = action.payload.token;
        state.users = action.payload;
        localStorage.setItem("token", JSON.stringify(state.token));
        localStorage.setItem("user", JSON.stringify(state.users));

      })

      .addCase(AddData.rejected, (state, action) => {
        state.result = true;
        state.error = action.error.message;
      })


      .addCase(updatetask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatetask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the task in the state with the updated data
        // state.tasks = state.tasks.map((task) =>
          // task._id === action.payload._id ? action.payload : task
          state.data=action.payload;
      })
      .addCase(updatetask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

  },
});



export default userSlice.reducer;




