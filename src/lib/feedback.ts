import { create } from 'zustand';

type FeedbackType = 'success' | 'error';

type FeedbackState = {
  message: string | null;
  type: FeedbackType;
  show: (message: string, type: FeedbackType) => void;
  clear: () => void;
};

export const useFeedbackStore = create<FeedbackState>((set) => ({
  message: null,
  type: 'success',
  show: (message, type) => set({ message, type }),
  clear: () => set({ message: null }),
}));

export function showSuccessFeedback(message: string): void {
  useFeedbackStore.getState().show(message, 'success');
}

export function showErrorFeedback(message: string): void {
  useFeedbackStore.getState().show(message, 'error');
}
