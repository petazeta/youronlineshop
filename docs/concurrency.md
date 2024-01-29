Server requests and concurrency
===============================

We must be aware that server requests from different clients could happend "simiultaneously" (also because posible asyncronicity in code). And there could be application states that, even when belonging to the current request process being performed, would also be shared between "simultaneous/concurrent" requests. We must be awere of it to desing the state data in a way that a posible state change produced by a request would not have effect to other request. For those reason no permanent data can be exclusive of one request (thread).

For example, at the layout system, the tree element that holds the folder structure can not be different for any request. It should be the same one. Other way there could be collision in data and wrong responses. A request can select a tree branch but the tree can not be different between requests. It could probably grow if there is a request for a branch that was not previously loaded because in this case wold cause no collision, but it can not mutate.

Regarding to database it could happend that a database change is not reflected in a prevous database access, that is normal. It is a lagging effect. We may be able to fix it with websockets but at the moment it is not such a big deal.
