const all_policies = []

const policy_array = []
const statutes = []
const divisions = []

policy_array.id = 1
policy_array.name = 'My Policy'

const statue = {}
const division = {}

statue.name = 'st1'
division.name = 'di1'

statutes.push(statue)
divisions.push(division)

policy_array.push(statutes)
policy_array.push(divisions)


console.log(policy_array)