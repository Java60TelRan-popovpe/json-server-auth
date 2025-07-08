import { faker } from '@faker-js/faker'
import axios from 'axios';
const N_EMPLOYEES = 100;
function createRandomEmployee() {
    const res = {};
    const gender = faker.helpers.arrayElement(["female", "male"])
    res.id = faker.string.uuid();
    res.department = faker.helpers.arrayElement(["QA", "Development", "Audit", "Accounting","Management"]);
    res.fullName = faker.person.fullName({sex: gender});
    res.avatar = getAvatar(gender);
    res.salary = faker.number.int({min:5000, max: 49999, multipleOf:100});
    res.birthDate = faker.date.birthdate({min: 20, max: 72, mode: "age"}).toISOString().substring(0, 10);
    res.userId="ADMIN"
    return res;
}
function getAvatar(gender) {
  let res = faker.image.avatar();
  res = gender == "male" ? res.replace("female", "male") : res.replace("/male", "/female");
  return res;
}
function createRandomEmployees() {
   return Array.from({length: N_EMPLOYEES}, () => createRandomEmployee());

}
const jsonRes = {
    "employees":createRandomEmployees()
}
console.log(JSON.stringify(jsonRes, null, 2))
