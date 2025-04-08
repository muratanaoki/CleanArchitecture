# Node.js/Express.js によるクリーンアーキテクチャの完全実装ガイド

このプロジェクトは、クリーンアーキテクチャの原則に忠実に従い、典型的なウェブアプリケーションでの実装パターンを示すNode.js/Express.jsプロジェクトです。

## 技術スタック

- Node.js (最新安定版)
- Express.js
- TypeScript
- MongoDB
- Jest (テスト用)
- TypeDI (依存性注入用)

## 機能

1. TODOアイテムのCRUD操作
   - TODOアイテムの作成、取得、更新、削除
   - TODOアイテムには「タイトル」「説明」「期限」「優先度」「状態」の属性

2. ユーザー管理
   - ユーザー登録/ログイン機能
   - ユーザーごとのTODOリスト管理
   - 簡易的なロール管理（一般ユーザー/管理者）

## クリーンアーキテクチャの4つの同心円レイヤー実装

### 1. エンティティ層（中心）
- 純粋なビジネスルールを含むドメインモデル
- 値オブジェクトの実装（例：TodoId, UserId, Priority, Status）
  - イミュータブル（不変）な実装
  - 自己検証ロジック
- エンティティの実装（例：Todo, User）
  - ビジネスルールのカプセル化
  - 状態変更のメソッド

### 2. ユースケース層
- アプリケーション固有のビジネスルール
- 入力ポート/出力ポートパターンの実装
- DTOの明確な使用（リクエスト/レスポンス）
- 依存性の逆転（リポジトリインターフェースへの依存）

### 3. インターフェースアダプター層
- コントローラーの実装（Express.jsとの接続）
- プレゼンター（出力形式の変換）
- リポジトリインターフェースの定義
- DTOとエンティティ間のマッピング

### 4. フレームワーク層（外側）
- Express.jsのセットアップ
- データベースドライバー
- リポジトリの実装クラス
- 認証メカニズム

## プロジェクト構造

```
src/
├── domain/                 # エンティティ層
│   ├── entities/           # エンティティクラス
│   └── valueObjects/       # 値オブジェクト
├── application/            # ユースケース層
│   ├── useCases/           # ユースケース実装
│   ├── ports/              # 入力/出力ポート
│   └── dtos/               # データ転送オブジェクト
├── interfaces/             # インターフェースアダプター層
│   ├── controllers/        # コントローラー
│   ├── presenters/         # プレゼンター
│   └── repositories/       # リポジトリインターフェース
└── infrastructure/         # フレームワーク層
    ├── express/            # Express.js設定
    ├── database/           # データベース接続
    ├── repositories/       # リポジトリ実装
    ├── auth/               # 認証関連
    └── config/             # 設定ファイル
```

## セットアップと実行方法

```bash
# 依存関係のインストール
npm install

# 開発モードで実行
npm run dev

# ビルド
npm run build

# 本番モードで実行
npm start

# テスト実行
npm test
```

## 重要な実装ポイント

1. 依存関係のルール
   - 内側のレイヤーは外側のレイヤーに依存しない実装
   - 依存性の逆転原則の適用例
   - インターフェースを使った抽象化

2. クリーンなデータフロー
   - HTTPリクエスト → DTO → エンティティ → ビジネスロジック → レスポンスDTO
   - 各レイヤーでの適切なデータ変換
   - 責任の明確な分離

3. エラーハンドリング
   - ドメインエラーの定義と処理
   - アプリケーションエラーの定義と処理
   - インフラストラクチャエラーの変換
   - グローバルエラーハンドラー

4. 実用的な実装パターン
   - リポジトリパターンの詳細な実装
   - ファクトリーパターンによるオブジェクト生成
   - 依存性注入のセットアップと使用方法
