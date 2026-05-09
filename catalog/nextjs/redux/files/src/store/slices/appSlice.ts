import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface AppState {
  count: number
  status: 'idle' | 'loading' | 'error'
}

const initialState: AppState = { count: 0, status: 'idle' }

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increment: (state) => { state.count += 1 },
    decrement: (state) => { state.count -= 1 },
    setStatus: (state, action: PayloadAction<AppState['status']>) => {
      state.status = action.payload
    },
  },
})

export const { increment, decrement, setStatus } = appSlice.actions
export const appReducer = appSlice.reducer
export const selectCount = (state: RootState) => state.app.count
export const selectStatus = (state: RootState) => state.app.status
