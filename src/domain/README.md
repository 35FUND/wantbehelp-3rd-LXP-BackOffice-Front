# Backend-Frontend Domain Mapping

`src/domain` is organized to match backend domain packages 1:1.

- `dashboard` -> `com.shortudy.backoffice.domain.dashboard`
- `content` -> `com.shortudy.backoffice.domain.content`
- `member` -> `com.shortudy.backoffice.domain.member`
- `comment` -> `com.shortudy.backoffice.domain.comment`
- `auth` -> `com.shortudy.backoffice.domain.auth`

Recommended internal structure per domain:

- `api/`: REST call functions
- `model/`: request/response types

Shared backend `global` package mapping:

- `src/global/common` -> `com.shortudy.backoffice.global.common`
- `src/global/config` -> `com.shortudy.backoffice.global.config`
- `src/global/error` -> `com.shortudy.backoffice.global.error`
