# MobX-helper

## Important

Ce tuto n'est possible que grâce a Michel Weststrate et à son [repo github](https://github.com/mobxjs/mobx-react-boilerplate) contenant un code boilerplate pour MobX. Vous pouvez cloner son projet ou celui-ci pour bénéficier d'une config parée à l'emploi des décorateurs, qui seront utilisés ci-dessous.

- Ce projet n'a donc pas vocation à intégrer MobX dans un projet React existant, nous n'utilisons pas create-react-app mais une config personalisée par mise en place par Michel Weststrate.

### Ready, Set, Go

Vous avez cloné le projet ? Ouvrez votre terminal si ce n'est pas déjà fait, placez vous dans le dossier contenant votre boilerplate MobX et pensez bien au petit npm install pour que les dépendances soient bien installées!

```terminal
npm install
```

Maintenant que vos dépendences sont ajoutées au projet, je veux attirer votre attention sur un fichier essentiel, celui-ci se nomme .babelrc

- votre projet plantera à la premiere utilisation d'un décorateur sans ce fichier, c'est lui qui instruit babel sur la manière de gérer les décorateurs.

Assez parlé de config et de boilerplate, écrivons un peu de code!

### Une app ultra simpliste

Dans un fichier que vous pouvez nommer src, histoire de coller aux conventions, vous pouvez d'ores et déjà créer un fichier index.js qui sera le chemin d'entrée à l'application. Pour ne pas avoir trop à gérer au même endroit, créons également un dossier models qui stockera un fichier counter.js dont le contenu sera une simple classe répertoriant les variables et les méthodes du compteur que nous allons mettre en place ensemble.

- Vous avez remarqué un fichier index.html à la racine de notre projet? C'est bien. En effet, il est important et il est intelligent d'y jeter un oeil pour voir si un id se balade dans le but d'y insérer notre app React. En l'occurence oui, il y a bien une div avec un id, intelligemment nommé root. Retenons cette info pour plus tard.

Commençons par s'occuper du coeur du sujet, le compteur. Ouvrons le fichier counter.js dans le dossier models et tapons la premiere ligne de code

```javascript
import { observable, computed, action, configure } from "mobx";
```

Vous l'avez compris, on importe des fonctionnalités depuis MobX. Nous allons vite connaitre leur utilisation dans les lignes qui suivent.

```javascript
configure({ enforceActions: "observed" });
```

Et si on se blindait tout de suite? En effet, la methode configure de MobX permet de préciser que chaque changement d'état devra exclusivement passer par une action autorisée par la classe contenant la variable à modifier. Sans cette option, n'importe qui peut assigner une nouvelle valeur à une variable suivie par MobX et ce n'est absolument pas ce que nous voulons. Empêchons ce comportement grace à cette ligne de code et passons à la suite, la classe Counter.

```javascript
export default class Counter {
  @observable count = 0;
}
```

Commençons simplement. La classe Counter ne va stocker qu'une seule donnée, la valeur du compteur. Nous l'initialisons à 0 et nous lui ajoutons le décorateur @observable. C'est limpide, la variable count est maintenant observée par MobX. Est-ce que cette valeur est amenée à évoluer? Oui, de toute évidence! Nous allons donc créer des actions autorisant la mise à jour de count.

```javascript
export default class Counter {
  @observable count = 0;

  @action add() {
    this.count++;
  }

  @action remove() {
    this.count--;
  }
}
```

Great! Nous avons ajouté 2 fonctions ultra simples qui incrémente ou décrémente notre variable count. Nous employons this car nous sommes dans une classe. Et vous avez bien sûr remarqué le décorateur @action qui permet d'indiquer à MobX que la fonction est autorisée à apporter une modification sur la variable indiquée comme étant observable.

Terminons notre classe avec une autre fonctionnalité de MobX:

```javascript
export default class Counter {
  @observable count = 0;

  @computed get square() {
    return this.count ** 2;
  }

  @action add() {
    this.count++;
  }

  @action remove() {
    this.count--;
  }
}
```

Nous avons ajouté un getter avec le décorateur @computed. Expliquons ce que fait notre fonction square(). Elle retourne simplement notre variable au carré. Elle est évidemment dépendante de la valeur de count et de ce fait, elle n'est qu'une déclinaison de celle-ci. Plutot que de prendre count au carré et le stocker dans une nouvelle variable observable, MobX veut nous inciter à travailler avec le moins de données possibles, et d'utiliser des valeurs @computed pour retourner des valeurs dérivées de notre variable d'origine.

Nous en avons fini pour notre classe Counter, afin de m'assurer que tout le monde suit, voici le code complet du fichier counter.js

```javascript
import { observable, computed, action, configure } from "mobx";

configure({ enforceActions: 'observed' });

export default class Counter {
  @observable count = 0;

  @computed get square() {
    return this.count ** 2;
  }

  @action add() {
    this.count++;
  }

  @action remove() {
    this.count--;
  }
}
```
