# Publish Approval Gate

## 원칙

Obsidian의 `06_Published`에 글이 도착해도 곧바로 Quartz로 이동하지 않는다. Quartz로 넘어가는 순간 공개 사이트 발행 단계에 들어가므로, 반드시 김민조의 최종 확인을 거친다.

## 승인 조건

Quartz sync 대상이 되려면 Published 파일 frontmatter에 아래 값이 있어야 한다.

```yaml
status: published
quartz_status: ready_for_quartz
quartz_user_approved: true
quartz_user_approved_at: YYYY-MM-DD
quartz_user_approval_note: "김민조 최종 확인 후 Quartz 반영 승인"
```

`quartz_user_approved: true`가 없으면 `scripts/sync-published.ps1`은 해당 글을 건너뛴다.

## 운영 흐름

1. 글이 Obsidian `06_Published`까지 도착한다.
2. 김민조가 최종 글을 읽고 문장, 근거, 공개 가능 여부를 확인한다.
3. 승인할 경우 frontmatter에 `quartz_user_approved: true`를 추가한다.
4. 그 뒤에만 `scripts/sync-published.ps1`을 실행한다.
5. Quartz 로컬 미리보기와 모바일 검수를 확인한다.
6. Git commit, push 후 GitHub Pages 배포를 확인한다.

## 자동화 금지선

- `06_Published` 도착만으로 Quartz sync를 실행하지 않는다.
- Claude Code, Codex, 자동화 스크립트는 사용자 승인 없이 `content/research`에 새 글을 복사하지 않는다.
- 예외가 필요하면 해당 글에 한해 김민조가 명시적으로 승인한다.
