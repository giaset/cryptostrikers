# Pack Creation Flow

1. Contract owner mints an entire run of cards at once (contract increments run #)

# Pack Sale Flow

1. User goes to the buy pack page and hits BUY
1. PackSale contract accepts ETH and *mints* 4 cards for the user (IMPORTANT!!! only the current PackSale contract can mint Series 1 cards)
1. User has a local store of card IDs he has seen, so when he goes to My Album, we highlight his new cards
