import { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  message,
  DatePicker,
  Card,
  Typography,
  Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import supabase from '../configdb/supabase';

const { Title } = Typography;

const goToDashboard = () => {
  window.location.href = '/dashboard';
};

interface Student {
  id: number;
  name: string;
  roll_num: string;
}

interface StudentWithAttendance extends Student {
  status?: 'Present' | 'Absent';
}

const Attendance = () => {
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1️⃣ Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('student_table')
        .select('*')
        .order('id', { ascending: true });

      if (studentsError) throw studentsError;

      // 2️⃣ Fetch attendance
      const dateStr = selectedDate.format('YYYY-MM-DD');

      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendence')
        .select('*')
        .eq('date', dateStr);

      if (attendanceError) throw attendanceError;

      // 3️⃣ Merge students + attendance
      const mergedData: StudentWithAttendance[] = (studentsData || []).map(
        (student) => {
          const record = attendanceData?.find(
            (a) => a.student_id === student.id
          );

          return {
            ...student,
            status: record?.status,
          };
        }
      );

      setStudents(mergedData);
    } catch (error: any) {
      message.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const markAttendance = async (
    studentId: number,
    status: 'Present' | 'Absent'
  ) => {
    try {
      const dateStr = selectedDate.format('YYYY-MM-DD');

      const { error } = await supabase.from('attendence').upsert(
        {
          student_id: studentId,
          date: dateStr,
          status,
        },
        {
          onConflict: 'student_id,date',
        }
      );

      if (error) throw error;

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, status } : s
        )
      );

      message.success(`Marked ${status}`);
    } catch (error: any) {
      message.error(`Failed to mark attendance: ${error.message}`);
    }
  };

  const columns: ColumnsType<StudentWithAttendance> = [
    {
      title: 'Roll No',
      dataIndex: 'roll_num',
      key: 'roll_num',
    },
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status?: 'Present' | 'Absent') => {
        if (!status) return <Tag>Not Marked</Tag>;

        return (
          <Tag color={status === 'Present' ? 'green' : 'red'}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type={record.status === 'Present' ? 'primary' : 'default'}
            style={
              record.status === 'Present'
                ? { backgroundColor: '#52c41a' }
                : undefined
            }
            onClick={() => markAttendance(record.id, 'Present')}
          >
            Present
          </Button>

          <Button
            size="small"
            danger
            type={record.status === 'Absent' ? 'primary' : 'default'}
            onClick={() => markAttendance(record.id, 'Absent')}
          >
            Absent
          </Button>
        </Space>
      ),
    },
  ];

  // ✅ FIXED TYPE: single DatePicker uses Dayjs | null
  const onDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Attendance
          </Title>

          <DatePicker
            value={selectedDate}
            onChange={onDateChange}
            allowClear={false}
          />
        </div>

        <Table
          rowKey="id"
          dataSource={students}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </Card>

      <Button style={{ marginTop: 16 }} onClick={goToDashboard}>
        Dashboard
      </Button>
    </div>
  );
};

export default Attendance;
