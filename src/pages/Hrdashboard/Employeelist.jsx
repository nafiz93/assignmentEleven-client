import useAuth from '@/hooks/useAuth';
import useAxios from '@/hooks/useAxios';
import { useQueries, useQuery } from '@tanstack/react-query';
import React from 'react';

export default function Employeelist() {
  const axios = useAxios();
  const { user, loading } = useAuth();

  const userId = user?.uid;

  const getEmployee = async () => {
    const response = await axios.get(`/users?uid=${userId}`);
    return response.data._id;
  };

  const { data: hrId, isLoading: companyLoading } = useQuery({
    queryKey: ['companyId', userId],
    queryFn: getEmployee,
    enabled: !!userId,
  });

  const getEmployees = async () => {
    const response = await axios.get(
      `/employees/incompany?companyId=${hrId}`
    );
    return response.data;
  };

  const {
    data: employees = [],
    isLoading: requestsLoading,
  } = useQuery({
    queryKey: ['employees', hrId],
    queryFn: getEmployees,
    enabled: !!hrId,
  });

  const getUserByUid = async (uid) => {
    const res = await axios.get(`/users?uid=${uid}`);
    return res.data;
  };

  const employeeUserQueries = useQueries({
    queries: employees.map((emp) => ({
      queryKey: ['user', emp.employeeUid],
      queryFn: () => getUserByUid(emp.employeeUid),
      enabled: !!emp.employeeUid,
    })),
  });

  const users = employeeUserQueries
    .map((q) => q.data)
    .filter(Boolean);

  const usersLoading = employeeUserQueries.some((q) => q.isLoading);

  if (loading || companyLoading || requestsLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Loading employees…
      </div>
    );
  }

  return (
    <div className="min-h-scree p-8">
      <h1 className="text-2xl font-semibold mb-6">Company Employees</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.uid}
              className="bg-primary rounded-xl shadow-sm border border-primary p-6 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Date of Birth:</span>{' '}
                  {user.dateOfBirth}
                </p>
                <p>
                  <span className="font-medium">Joined:</span>{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
