const error = require("restify-errors");
const Customer = require("../models/Customer");

module.exports = (server) => {
  // Get customers
  server.get("/customers", (req, res, next) => {
    try {
      Customer.find().then((data) => res.send(data.data), next());
    } catch (error) {
      return next(new error.InvalidContentError(error));
    }
  });

  // Get single customer
  server.get("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new error.NotFoundError(
          `No customer found with the id of ${req.params.id}`
        )
      );
    }
  });

  // Create customer
  server.post("/customers", (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new error.InvalidContentError("expect 'application/json'"));
    }
    const { name, email, amount } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      amount,
    });
    newCustomer
      .save()
      .then((data) => {
        const user = data.data;
        res.send({ data });
        next();
      })
      .catch((err) => next(new error.InternalError(err)));
  });

  // Update customer
  server.put("/customers/:id", (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new error.InvalidContentError("expect 'application/json'"));
    }
    Customer.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then((_) => res.send(200))
      .catch((err) => {
        return next(
          new error.NotFoundError(
            `No customer found with the id of ${req.params.id}`
          )
        );
      });
  });

  // Delete customer
  server.del("/customers/:id", (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new error.InvalidContentError("expect 'application/json'"));
    }

    Customer.findByIdAndDelete({ _id: req.params.id })
      .then((_) => res.send(200))
      .catch((err) => {
        return next(
          new error.NotFoundError(
            `No customer found with the id of ${req.params.id}`
          )
        );
      });
  });
};
