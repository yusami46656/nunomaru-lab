#!/usr/bin/env python3
"""Supabase に貼る前に3通の組版をブラウザで確認するための _preview.html を作る。

テンプレート内の Go 変数（{{ .TokenHash }} など）をダミー値に置き換えて並べるだけ。
使い方: python supabase/email-templates/build-preview.py
"""
import pathlib

HERE = pathlib.Path(__file__).parent

SAMPLE = {
    "{{ .SiteURL }}": "https://www.nunomaru-lab.com",
    "{{ .TokenHash }}": "pkce_9f2c1a7b4d8e0364a5b1c9d7e2f83a10b6c4d5e7f8091a2b3c4d5e6f7a8b9c0d",
    "{{ .Email }}": "old-address@example.com",
    "{{ .NewEmail }}": "new-address@example.com",
    "{{ .ConfirmationURL }}": "#confirmation-url-placeholder",
}

TEMPLATES = [
    ("confirm-signup.html", "Confirm sign up", "【家謎】メールアドレスのご確認"),
    ("reset-password.html", "Reset password", "【家謎】パスワード再設定のご案内"),
    ("change-email-address.html", "Change email address", "【家謎】メールアドレス変更のご確認"),
]

parts = []
for filename, template_name, subject in TEMPLATES:
    body = (HERE / filename).read_text(encoding="utf-8")
    for key, value in SAMPLE.items():
        body = body.replace(key, value)
    parts.append(
        f'<section style="margin:0 0 56px;">'
        f'<div style="max-width:624px;margin:0 auto 10px;padding:0 12px;'
        f'font:600 13px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;color:#666;">'
        f'{template_name}<br>'
        f'<span style="font-weight:400;color:#999;">件名: {subject}</span>'
        f'</div>{body}</section>'
    )

html = (
    '<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n'
    '<title>家謎 認証メール プレビュー</title>\n'
    '</head>\n<body style="margin:0;padding:40px 0;background:#e9e7e1;">\n'
    + "\n".join(parts)
    + "\n</body>\n</html>\n"
)
(HERE / "_preview.html").write_text(html, encoding="utf-8")
print("wrote", HERE / "_preview.html")
