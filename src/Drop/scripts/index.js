const newData = [];
const errorData = [];

const validations = {
  isEmail: function matchEmail(str) {
    const testregex = str.match(/(.+)(@\w+)\.(.*)/);
    return testregex ? true : false;
  },
  isOnlyText: function matchPhone(phone) {
    const testregex = phone.match(/\d+/);
    return testregex ? true : false;
  },
};

const emails = [];
const handleMigrations = (data) => {
  console.log(data);
  data.forEach((row) => {
    if (!validations.isEmail(row["Email"])) {
      return errorData.push(row);
    }
    const duplicate = emails.find((email) => email === row["Email"]);
    if (duplicate) {
      return errorData.push(row);
    }
    emails.push(row["Email"]);
    const phone = row["Telefono Movil"].toString();
    const newphone = phone.replace(/\D*/g, "");
    row["Telefono Movil"] = newphone;
    newData.push(row);
  });
  console.log({ newData, errorData });
};

export { handleMigrations };
