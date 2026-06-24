import { Router, type IRouter } from "express";
import healthRouter from "./health";
import filtersRouter from "./filters";
import screenersRouter from "./screeners";
import marketsRouter from "./markets";
import etfHoldingsRouter from "./etf_holdings";
import rebalanceRouter from "./rebalance";
import adminRouter from "./admin";
import stockRouter from "./stock";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(filtersRouter);
router.use(screenersRouter);
router.use(marketsRouter);
router.use(etfHoldingsRouter);
router.use(rebalanceRouter);
router.use(adminRouter);
// stock router mounted last: its `/conference/:code` must not shadow the more
// specific `/conference/sentiment_stats` defined in adminRouter.
router.use(stockRouter);
router.use(contactRouter);

export default router;
