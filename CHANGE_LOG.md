# **CHANGE LOG**

### **SEE MORE DETAILS ABOUT NEW FEATURES IN `README`**

---

## Version 1.1.2

### Features

1. Added `subscribeToNotification` function to avoid using `subscribeToNotifications` function when subscribing to one notification.

### Bugs

1. fixed bug when retrieveing unexisting mediator would throw error
2. fixed bug when subscribing to same `notification` multiple times could stop handling notifications next of duplacate one. Added warning message for this case.

### Other changes

1. Now some of `native` properties and functions are `protected` not `private`. This will make easier debugging and will give more freedom in code.
2. Optimized `exclusiveSubCommand`'s workflow.

## Version 1.0.17 -> Version 1.1.1

### Features

1. Added `addExclusiveSubCommand` function is `Command`s
1. Added `registerMediators` and `removeMediators` functions.

### Bugs

1.  `Guard`s checks logic fix.

---

## Version 1.0.11

### Features

1. Added `onAnyGuardApproved` function in `SimpleCommand`

### Bugs

1. `Guard`s asynchronicity logic fix, without affecting previus usage

---

## Version 1.0.9

### Features

1. `Guard`'s `approve` function can be async.

### Bugs

1. Fixed mistake in function name in `SimpleCommand`. `setndNotification` to `sendNotification`

---

## Version 1.0.8

### Features

1.  Added `Guard` for command, it can be used to make checks before command will `execute`.
2.  Added `onAnyGuardDenied` and `onAllGuardsDenied` functions in `SimpleCommand`.
3.  Added `setMediatorId` function.
4.  Added `retrieveMediators` function.
