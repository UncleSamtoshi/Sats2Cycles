export const TIP_REPL = `
mutation TipSendTip($input: SendTipInput!) { sendTip(input: $input) { ... on UserError { __typename message } ... on NotFoundError { __typename message } ... on UnauthorizedError { __typename message } ... on SendTipResult { __typename repl { id ...TipReplFragment ...TopTipperReplLeaderboard __typename } theme { id ...TipThemeFragment ...TopTipperThemeLeaderboard __typename } currentUser { id ...CyclesBalanceFragment __typename } } __typename } } fragment TipReplFragment on Repl { id slug user { id __typename } totalCyclesTips currentUserTotalTips __typename } fragment TopTipperReplLeaderboard on Repl { id topTippers { ...TopTippersFragment __typename } __typename } fragment TopTippersFragment on TipperUser { user { id username url image __typename } totalCyclesTipped __typename } fragment TipThemeFragment on CustomTheme { id slug author { id __typename } totalCyclesTips currentUserTotalTips __typename } fragment TopTipperThemeLeaderboard on CustomTheme { id topTippers { ...TopTippersFragment __typename } __typename } fragment CyclesBalanceFragment on CurrentUser { id cycles { balance { __typename ... on CyclesBalance { cycles lastUpdated __typename } ... on UnauthorizedError { message __typename } ... on ServiceUnavailable { message __typename } } __typename } __typename }
`
