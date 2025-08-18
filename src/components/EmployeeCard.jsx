// components/EmployeeCard.jsx
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Mail, Phone, MapPin, Calendar, DollarSign, User } from 'lucide-react';
import React, { useRef } from 'react';

const EmployeeCard = ({ employee, onEdit, onDelete, getStatusColor, handleAvatarChange }) => {
  const fileInputRef = useRef();

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card key={employee.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <CardTitle className="text-lg text-slate-800">
                {employee.first_name} {employee.last_name}
              </CardTitle>
              <p className="text-slate-600">{employee.designation?.title}</p>
              <Badge className={`mt-2 ${getStatusColor(employee.status)}`}>
                {employee.status}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600"
              onClick={() => onDelete(employee)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            {/* Details */}
            <div className="flex items-center space-x-3 text-sm">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">ID: {employee.id}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{employee.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{employee.phone_number}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{employee.department?.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{employee.salary}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">
                Joined: {new Date(employee.date_of_joining).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Avatar with edit on hover */}
          <div className="relative group" style={{ width: '8rem', height: '8rem' }}>
            {employee.avatarUrl ? (
              <img
                src={employee.avatarUrl}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl rounded-md">
                {employee.avatar}
              </div>
            )}

            <div
              onClick={triggerFileUpload}
              className="absolute bottom-0 left-0 right-0 h-8 bg-black bg-opacity-50 rounded-b-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Edit3 className="text-white w-4 h-4 z-10" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleAvatarChange(e, employee.id)}
              className="hidden"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;