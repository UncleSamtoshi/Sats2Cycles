export const GET_CYCLES = `
  {
    currentUser {
      id
      ...CyclesBalanceFragment
      __typename
    }
  }

  fragment CyclesBalanceFragment on CurrentUser {
    id
    cycles {
      balance {
        __typename
        ... on CyclesBalance {
          cycles
          lastUpdated
          __typename
        }
        ... on UnauthorizedError {
          message
          __typename
        }
        ... on ServiceUnavailable {
          message
          __typename
        }
      }
      __typename
    }
    __typename
  }
`

export const REPL_INFO = `
query ReplView($url: String!) {
  repl(url: $url) {
    ... on Repl {
      id
      imageUrl
      ...ReplViewRepl
      __typename
    }
    __typename
  }
  currentUser {
    id
    ...ReplViewCurrentUser
    __typename
  }
}

fragment ReplViewRepl on Repl {
  id
  title
  timeCreated
  imageUrl
  analyticsUrl
  releasesForkCount
  publicForkCount
  owner {
    ... on Team {
      id
      username
      url
      image
      __typename
    }
    ... on User {
      id
      username
      url
      image
      __typename
    }
    __typename
  }
  relatedRepls(limitPerGroup: 3) {
    name
    repls {
      id
      publishedAs
      ...ReplLinkRepl
      ...TemplateReplCardRepl
      ...ReplPostReplCardRepl
      __typename
    }
    __typename
  }
  lang {
    id
    displayName
    __typename
  }
  currentUserPermissions {
    containerWrite
    publish
    changeIconUrl
    __typename
  }
  publishedAs
  deployment {
    id
    activeRelease {
      id
      timeCreated
      __typename
    }
    __typename
  }
  ...ReplViewReplTitleRepl
  ...ReplViewReplViewerRepl
  ...ReplLinkRepl
  ...ReplViewFooterRepl
  __typename
}

fragment ReplLinkRepl on Repl {
  id
  url
  nextPagePathname
  __typename
}

fragment TemplateReplCardRepl on Repl {
  id
  iconUrl
  templateCategory
  title
  description(plainText: true)
  releasesForkCount
  templateLabel
  likeCount
  url
  owner {
    ... on User {
      id
      ...TemplateReplCardFooterUser
      __typename
    }
    ... on Team {
      id
      ...TemplateReplCardFooterTeam
      __typename
    }
    __typename
  }
  deployment {
    id
    activeRelease {
      id
      __typename
    }
    __typename
  }
  publishedAs
  __typename
}

fragment TemplateReplCardFooterUser on User {
  id
  username
  image
  url
  __typename
}

fragment TemplateReplCardFooterTeam on Team {
  id
  username
  image
  url
  __typename
}

fragment ReplPostReplCardRepl on Repl {
  id
  iconUrl
  description(plainText: true)
  ...ReplPostReplInfoRepl
  ...ReplStatsRepl
  ...ReplLinkRepl
  tags {
    id
    ...PostsFeedNavTag
    __typename
  }
  owner {
    ... on Team {
      id
      username
      url
      image
      __typename
    }
    ... on User {
      id
      username
      url
      image
      __typename
    }
    __typename
  }
  __typename
}

fragment ReplPostReplInfoRepl on Repl {
  id
  title
  description(plainText: true)
  imageUrl
  iconUrl
  templateInfo {
    label
    iconUrl
    __typename
  }
  __typename
}

fragment ReplStatsRepl on Repl {
  id
  likeCount
  runCount
  commentCount
  __typename
}

fragment PostsFeedNavTag on Tag {
  id
  isOfficial
  __typename
}

fragment ReplViewReplTitleRepl on Repl {
  id
  title
  iconUrl
  templateInfo {
    iconUrl
    __typename
  }
  owner {
    ... on User {
      id
      username
      __typename
    }
    ... on Team {
      id
      username
      __typename
    }
    __typename
  }
  ...ReplViewReplActionsPermissions
  __typename
}

fragment ReplViewReplActionsPermissions on Repl {
  id
  slug
  lastPublishedAt
  publishedAs
  owner {
    ... on User {
      id
      username
      __typename
    }
    ... on Team {
      id
      username
      __typename
    }
    __typename
  }
  templateReview {
    id
    promoted
    __typename
  }
  currentUserPermissions {
    publish
    containerWrite
    __typename
  }
  ...UnpublishReplRepl
  ...ReplLinkRepl
  __typename
}

fragment UnpublishReplRepl on Repl {
  id
  commentCount
  likeCount
  runCount
  publishedAs
  __typename
}

fragment ReplViewReplViewerRepl on Repl {
  id
  publishedAs
  runCount
  publicForkCount
  releasesForkCount
  prodUrl: hostedUrl(dotty: true)
  isProject
  nextPagePathname
  lang {
    id
    header
    displayName
    __typename
  }
  ...ReplViewerOutputOverlayRepl
  ...UseReplViewerRepl
  ...LikeButtonRepl
  __typename
}

fragment ReplViewerOutputOverlayRepl on Repl {
  id
  title
  imageUrl
  lastPublishedAt
  currentUserPermissions {
    changeImageUrl
    __typename
  }
  __typename
}

fragment UseReplViewerRepl on Repl {
  id
  previewUrl: hostedUrl(dotty: false, dev: false)
  url
  wasPosted
  wasPublished
  publishedAs
  isProject
  lang {
    id
    canUseShellRunner
    __typename
  }
  config {
    isServer
    isVnc
    __typename
  }
  deployment {
    id
    activeRelease {
      id
      previewUrl: hostedUrl
      __typename
    }
    __typename
  }
  replViewSettings {
    id
    defaultView
    replFile
    __typename
  }
  ...CrosisContextRepl
  __typename
}

fragment CrosisContextRepl on Repl {
  id
  language
  slug
  user {
    id
    username
    __typename
  }
  currentUserPermissions {
    containerWrite
    __typename
  }
  __typename
}

fragment LikeButtonRepl on Repl {
  id
  currentUserDidLike
  likeCount
  url
  wasPosted
  wasPublished
  __typename
}

fragment ReplViewFooterRepl on Repl {
  id
  description
  lastPublishedAt
  timeCreated
  publishedAs
  runCount
  deployment {
    id
    activeRelease {
      id
      timeCreated
      __typename
    }
    __typename
  }
  owner {
    ... on Team {
      id
      username
      url
      image
      followerCount
      isFollowedByCurrentUser
      __typename
    }
    ... on User {
      id
      username
      url
      image
      followerCount
      isFollowedByCurrentUser
      __typename
    }
    __typename
  }
  source {
    release {
      id
      __typename
    }
    deployment {
      id
      repl {
        id
        ...ReplViewSourceRepl
        __typename
      }
      __typename
    }
    __typename
  }
  tags {
    id
    __typename
  }
  origin {
    id
    ...ReplViewSourceRepl
    __typename
  }
  __typename
}

fragment ReplViewSourceRepl on Repl {
  id
  iconUrl
  title
  templateLabel
  ...ReplLinkRepl
  owner {
    ... on Team {
      id
      username
      url
      image
      __typename
    }
    ... on User {
      id
      username
      url
      image
      __typename
    }
    __typename
  }
  __typename
}

fragment ReplViewCurrentUser on CurrentUser {
  id
  username
  isSubscribed
  isModerator: hasRole(role: MODERATOR)
  isAdmin: hasRole(role: ADMIN)
  ...ReplViewReplViewerCurrentUser
  __typename
}

fragment ReplViewReplViewerCurrentUser on CurrentUser {
  id
  ...LikeButtonCurrentUser
  ...CrosisContextCurrentUser
  __typename
}

fragment LikeButtonCurrentUser on CurrentUser {
  id
  isVerified
  __typename
}

fragment CrosisContextCurrentUser on CurrentUser {
  id
  username
  isSubscribed
  roles {
    id
    name
    __typename
  }
  __typename
}
`
