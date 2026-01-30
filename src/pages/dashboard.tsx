import { useEffect, useState } from 'react';
import { Form, Input, Button, message, Table, Card, Popconfirm } from 'antd';
import supabase from '../configdb/supabase';

const StudentPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const Nextpage= () => {
    window.location.href = '/Attendence';
 }
  const [form] = Form.useForm();

  // Fetch students
  const getStudents = async () => {
    const { data, error } = await supabase
      .from('student_table')
      .select('*')
      .order('id', { ascending: false });
    if (!error) setStudents(data || []);
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Add or Update student
  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    if (isEditMode && editingId) {
      // Update existing student
      const { error } = await supabase
        .from('student_table')
        .update(values)
        .eq('id', editingId);
      
      if (error) {
        message.error(error.message);
      } else {
        message.success('Student updated successfully');
        cancelEdit();
      }
    } else {
      // Add new student
      const { error } = await supabase.from('student_table').insert(values);
      
      if (error) {
        message.error(error.message);
      } else {
        message.success('Student added successfully');
        form.resetFields();
      }
    }
    
    setLoading(false);
    getStudents();
  };

  // Delete student
  const deleteStudent = async (id: number) => {
    const { error } = await supabase.from('student_table').delete().eq('id', id);
    if (error) {
      message.error(error.message);
    } else {
      message.success('Student deleted successfully');
      getStudents();
    }
  };

  // Start editing
  const startEdit = (student: any) => {
    setIsEditMode(true);
    setEditingId(student.id);
    form.setFieldsValue({
      name: student.name,
      roll_num: student.roll_num,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingId(null);
    form.resetFields();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Roll No', dataIndex: 'roll_num' },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <>
          <Button type="link"  onClick={() => startEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => deleteStudent(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <Card 
        title={isEditMode ? 'Edit Student' : 'Add Student'} 
        style={{ marginBottom: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            label="Name" 
            name="name" 
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="Roll Number" 
            name="roll_num" 
            rules={[{ required: true, message: 'Please enter roll number' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditMode ? 'Update Student' : 'Add Student'}
          </Button>
          {isEditMode && (
            <Button 
              style={{ marginLeft: 10 }} 
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          )}
        </Form>
      </Card>

      <Card title="Student List">
        <Table 
          dataSource={students} 
          columns={columns} 
          rowKey="id" 
          pagination={false} 
        />
      </Card>
      <Button onClick={Nextpage}>attendence </Button>
    </div>
  );
};

export default StudentPage;