import Employees from './Employees';

const HistoryPage = () => {
  return (
    <Employees
      filterByStatus={['Suspended']}
      showAddButton={false}
      customTitle="Suspended Employees"
      customSubtitle="List of employees who are currently suspended"
      readOnly={true}
    />
  );
};

export default HistoryPage;