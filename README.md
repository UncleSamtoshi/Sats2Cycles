# Tip Cycles with Bitcoin!

Use the hardest money there is to tip other repls. You can even tip yourself as a way to "buy" cycles with bitcoin.

## Warning!

There may be bugs and you may not get your cycles! I won't be doing any customer service on this, so treat each purchase as a risk that you may not get the cycles (Although I will try to make it work). Also know that when 100 cycles are tipped, the receiver currently only gets 10.

## How it works
1. A user enters a repl url that is tippable and the amount of desired cycles to purchase (right now only 100 is supported).
2. The backend will check if it has enough cycles to sell and if it does it will generate a lightning payment request.
3. When the lightning payment is completed, it triggers a webhook back into this repl. The webhook checks if the invoice was paid and if it was it will make an api call to replit to tip the initially provided repl.


## To Do
- Style the frontend and write better copy
- Clean up unused packages
- Switch to express js for the backend so a socket io server can be set up to notficy the client
- Add a section to the readme for developers to get started 
- Build out a real price feed
- Build out a true CycleBalanceService (right now it is just hard coded)
