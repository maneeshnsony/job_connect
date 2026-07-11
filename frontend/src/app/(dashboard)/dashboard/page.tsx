'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOutreaches, createOutreach, updateOutreach, deleteOutreach, Outreach } from '@/lib/api';
import OutreachTable from '@/components/OutreachTable';
import OutreachModal from '@/components/OutreachModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOutreach, setEditingOutreach] = useState<Outreach | null>(null);
  const [deletingOutreach, setDeletingOutreach] = useState<Outreach | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['outreaches'],
    queryFn: getOutreaches,
  });

  const createMutation = useMutation({
    mutationFn: createOutreach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreaches'] });
      setShowAddModal(false);
      toast.success('Outreach record created');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Outreach> }) => updateOutreach(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreaches'] });
      setEditingOutreach(null);
      toast.success('Outreach record updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOutreach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreaches'] });
      setDeletingOutreach(null);
      toast.success('Outreach record deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete');
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Outreach Tracker</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your recruiter outreach records</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add New
        </button>
      </div>

      <OutreachTable
        data={data?.data || []}
        isLoading={isLoading}
        error={error as Error | null}
        onEdit={(outreach) => setEditingOutreach(outreach)}
        onDelete={(outreach) => setDeletingOutreach(outreach)}
      />

      {(showAddModal || editingOutreach) && (
        <OutreachModal
          outreach={editingOutreach}
          onClose={() => { setShowAddModal(false); setEditingOutreach(null); }}
          onSave={(data) => {
            if (editingOutreach) {
              updateMutation.mutate({ id: editingOutreach.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deletingOutreach && (
        <DeleteConfirmModal
          outreach={deletingOutreach}
          onClose={() => setDeletingOutreach(null)}
          onConfirm={() => deleteMutation.mutate(deletingOutreach.id)}
          saving={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
