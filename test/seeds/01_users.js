exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                {
                    id: 1,
                    name: 'Nigel',
                    email: 'nigel@email.com',
                    dob: '2001-09-02'
                },
                {
                    id: 2,
                    name: 'Nakaz',
                    email: 'nakaz@email.com',
                    dob: '2002-03-14'
                },
                {
                    id: 3,
                    name: 'Jaywon',
                    email: 'jaywon@email.com',
                    dob: '1999-01-21'
                }
            ]);
        });
};