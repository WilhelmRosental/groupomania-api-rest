# Guide d'utilisation des tests Postman - API Groupomania

Ce document explique comment utiliser la collection de tests Postman pour tester l'API REST Groupomania.

## Fichiers fournis

1. **Groupomania_API_Tests.postman_collection.json** - Collection complète de tests
2. **Groupomania_Environment.postman_environment.json** - Environnement avec variables
3. **README_Postman.md** - Ce guide d'utilisation

## Installation et configuration

### 1. Import dans Postman

1. Ouvrez Postman
2. Cliquez sur "Import" en haut à gauche
3. Importez les deux fichiers JSON :
   - `Groupomania_API_Tests.postman_collection.json`
   - `Groupomania_Environment.postman_environment.json`

### 2. Configuration de l'environnement

1. Sélectionnez l'environnement "Groupomania Environment" en haut à droite
2. Vérifiez que `baseUrl` est configuré sur `http://localhost:3000`
3. Assurez-vous que votre serveur API est démarré sur le port 3000

## Structure des tests

### 📁 Authentication

- **Register User** - Créer un nouveau compte utilisateur
- **Login User** - Se connecter et récupérer le token JWT

### 📁 Posts

- **Create Post** - Créer un nouveau post (avec ou sans image)
- **Get All Posts** - Récupérer tous les posts
- **Get Post by ID** - Récupérer un post spécifique
- **Update Post** - Modifier un post existant
- **Like Post** - Aimer un post
- **Dislike Post** - Ne pas aimer un post
- **Delete Post** - Supprimer un post

### 📁 Comments

- **Create Comment** - Ajouter un commentaire à un post
- **Get Comments for Post** - Récupérer tous les commentaires d'un post
- **Update Comment** - Modifier un commentaire
- **Delete Comment** - Supprimer un commentaire

### 📁 Users

- **Get User Profile** - Récupérer le profil utilisateur
- **Update User Profile** - Modifier le profil utilisateur
- **Delete User** - Supprimer un compte utilisateur

### 📁 Error Cases

- **Unauthorized Access** - Test d'accès sans authentification
- **Invalid Login Credentials** - Test avec des identifiants incorrects
- **Get Non-existent Post** - Test avec un post inexistant

## Ordre d'exécution recommandé

### Séquence de base pour un test complet :

1. **Register User** - Créer un compte de test
2. **Login User** - Se connecter et obtenir le token
3. **Create Post** - Créer un post de test
4. **Get All Posts** - Vérifier que le post apparaît
5. **Get Post by ID** - Récupérer le post spécifique
6. **Like Post** - Tester la fonctionnalité de like
7. **Create Comment** - Ajouter un commentaire
8. **Get Comments for Post** - Vérifier les commentaires
9. **Update Comment** - Modifier le commentaire
10. **Update Post** - Modifier le post
11. **Delete Comment** - Supprimer le commentaire
12. **Delete Post** - Supprimer le post
13. **Delete User** - Supprimer le compte de test

## Variables automatiques

Les tests utilisent des variables d'environnement qui sont automatiquement mises à jour :

- `authToken` - Token JWT récupéré lors du login
- `userId` - ID de l'utilisateur connecté
- `postId` - ID du dernier post créé/récupéré
- `commentId` - ID du dernier commentaire créé/récupéré

## Tests automatiques inclus

Chaque requête inclut des tests automatiques qui vérifient :

- **Code de statut HTTP** approprié
- **Structure de la réponse** (propriétés requises)
- **Mise à jour des variables** d'environnement
- **Messages d'erreur** pour les cas d'échec

## Exécution en lot

### Runner de collection

1. Cliquez sur les "..." à côté de la collection
2. Sélectionnez "Run collection"
3. Choisissez l'environnement "Groupomania Environment"
4. Cliquez sur "Run Groupomania API Tests"

### Ordre personnalisé

Si vous voulez tester dans un ordre spécifique :

1. Décochez les tests que vous ne voulez pas exécuter
2. Organisez l'ordre dans le runner
3. Lancez l'exécution

## Personnalisation

### Modifier les données de test

Vous pouvez modifier les données dans le body des requêtes :

```json
{
  "email": "votre-email@example.com",
  "password": "votre-mot-de-passe",
  "firstName": "Votre-Prénom",
  "lastName": "Votre-Nom"
}
```

### Ajouter des images

Pour les tests avec upload d'images :

1. Ouvrez la requête "Create Post"
2. Dans l'onglet "Body", type "form-data"
3. Pour le champ "image", sélectionnez un fichier local

### Tests personnalisés

Vous pouvez ajouter vos propres tests dans l'onglet "Tests" de chaque requête :

```javascript
pm.test('Mon test personnalisé', function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.someProperty).to.eql('expectedValue');
});
```

## Dépannage

### Erreurs communes

1. **401 Unauthorized**
   - Vérifiez que le token est bien défini dans les variables
   - Re-exécutez le test "Login User"

2. **404 Not Found**
   - Vérifiez que l'API est démarrée
   - Vérifiez l'URL de base dans l'environnement

3. **500 Internal Server Error**
   - Vérifiez les logs du serveur
   - Vérifiez la connexion à la base de données

### Variables manquantes

Si une variable n'est pas définie :

1. Allez dans l'environnement
2. Vérifiez les valeurs "Current Value"
3. Réexécutez les tests précédents si nécessaire

## Support

Pour toute question ou problème avec les tests :

1. Vérifiez que votre API est conforme aux endpoints testés
2. Consultez les logs de votre serveur pour les erreurs
3. Vérifiez la documentation de votre API
