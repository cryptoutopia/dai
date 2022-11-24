# This is waht I'm trying to do here .. ::




_NOTE: Please use Javascript or Typescript with exercises where it makes sense._

You will need a [Infura](https://infura.io) / [Alchemy](https://www.alchemy.com) account to connect to the Ethereum Node.
   You can use free-tier resources for this test.

## Basic

A) Please make improvements to the code below, using Javascript. If you are making any assumptions about how the code functions please make note of them.

```
connectToDatabase()
.then((database)  => {
    return getUser(database, 'email@email.com')
    .then(user => {
        return getUserSettings(database, user.id)
        .then(settings => {
            return setRole(database, user.id, "ADMIN")
            .then(success => {
                return notifyUser(user.id, "USER_ROLE_UPDATED")
                .then(success => {
                    return notifyAdmins("USER_ROLE_UPDATED")
                })
            })
        })
    })
})
```

## Practical


1. Create a React / Next application that interacts with the the [DAI smart contract](https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f) and has the following properties:
	- List last 100 DAI Transfers and include their etherscan link, timestamp, amount of DAI transferred, sender and recipient,
	- Update the list every time there is a new event,
	- Create two inputs. First allows filtering events by sender and the second by recipient. Same rules about first 100 DAI Transfers and updating the list apply.
	- Make the list sortable by event timestamp and value,

2. (Bonus):
    - Use typescript,
    - Use tailwind for styling,
    - The app UX should be mobile friendly,
    - Write a couple of tests,
    
