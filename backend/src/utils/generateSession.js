const getCurrentSession = () => {
  const today = new Date();
  const year = today.getFullYear();

  const startDate = new Date(year, 6, 1);
  const endDate = new Date(year + 1, 5, 30);

  return today >= startDate && today <= endDate ? year : year - 1;
};


export default getCurrentSession