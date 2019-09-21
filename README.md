# MobX-helper

## Important

Ce tuto n'est possible que grâce a Michel Weststrate et à son [repo github](https://github.com/mobxjs/mobx-react-boilerplate) contenant un code boilerplate pour MobX. Vous pouvez cloner son projet ou celui-ci pour bénéficier d'une config parée à l'emploi des décorateurs, qui seront utilisés ci-dessous.

- Ce projet n'a donc pas vocation à intégrer MobX dans un projet React existant, nous n'utilisons pas create-react-app mais une config personalisée mise en place par Michel Weststrate.

Terminons ce petit préambule en gardant de coté la [doc officielle de MobX](https://mobx.js.org/) au cas où.

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

Commençons simplement. La classe Counter ne va stocker qu'une seule donnée, la valeur du compteur. Nous l'initialisons à 0 et nous lui ajoutons le décorateur @observable. C'est limpide, la variable count est maintenant observée par MobX. Est-ce que cette valeur est amenée à évoluer? Oui, de toute évidence! Nous allons donc créer des actions autorisant la mise à jour de count. Le terme export default devant la classe signifie simplement que nous autorisons d'autres fichier à importer la classe compteur et à en faire usage.

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

### Créons notre composant et intégrons-y notre compteur

Revenons dans notre dossier src et ouvrons index.js afin de terminer notre application. Tout d'abord, de quoi avons nous besoin ?

```javascript 
import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";
import Counter from "./models/counter";
```

Des têtes connues me direz-vous! Nous allons sans surprise utiliser react pour notre composant et reactDOM pour l'afficher dans notre navigateur.
MobX pourrait fonctionner seul, la cohabitation avec react se fait par la librairie mobx-react qui va permettre à nos composants de devenir observateur des variables déclarées comme étant observable. C'est donc la méthode observer qui sera associée à notre futur composant pour que tout fonctionne correctement. Nous avons également besoin de la classe Counter et nous l'importons ici en indiquant son chemin d'accès, ceci est possible puisque dans notre précédent fichier, nous avons explicitement déclaré notre class avec un export default. Makes sense right? Continuons.

```javascript
const appState = new Counter();
```

Nous créons une instance de Counter grâce au mot clé new et nous la stockons dans une variable appState. C'est cette instance qui devra être communiqué à notre composant.

Avant de s'attaquer au composant, occupons nous du render car nous avons une chose à penser dès maintenant:

```javascript
ReactDOM.render(<App store={appState} />, document.querySelector("#root"));
```

Rien de fou dans cette ligne de code, mais j'attire votre attention sur l'importance de déclarer un store qui sera passé en props à votre composant. Ce store va contenir les données à observer afin de le rendre réactif et sans surprise nous alimentons le store avec la seule donnée que nous traitons ici, la classe Counter stockée dans la variable appState.

Passons à l'étape finale, le composant que nous allons sobrement nommé App.

```javascript
const App = observer(({ store }) => (
  <div>
    <div className="count">{store.count}</div>
    <button onClick={() => store.remove()}> - </button>
    <button onClick={() => store.add()}> + </button>
    <div>Ton chiffre au carré est égal à {store.square}</div>
  </div>
));
```

De l'inconnu et du classique ici! Remarquons la syntaxe nouvelle pour déclarer notre composant : 

```javascript
const App  = observer(()=>{
  //votre code ici
})
```

La méthode observer() wrappe votre composant React classique qui se retrouve dans un callback. En guise d'argument c'est le moment de lui passer le store déclaré dans l'étape précédente.

Nous avons utilisé la syntaxe ES6 de destructuration pour récupérer directement le store venant des props. Notre composant fonctionnel retourne une div contenant nos éléments, le compteur dont il est question depuis le début du tuto, 2 boutons + et - permettant de déclencher les actions add() et remove(), puis notre résultat final qui est la valeur du compteur au carré, autrement dit une simple valeur dérivée obtenue grâce au décorateur @computed.

Mesdames, Messieurs, il est l'heure de tester notre app! Enregistrez bien chacun des fichiers modifiés et retournez dans votre terminal. La commande npm run start ou yarn start va démarrer notre serveur et exécuter notre code. Le résultat ne sera pas très beau mais fonctionnel si tout s'est bien passé!

Voici le code complet du fichier index.js : 

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";
import Counter from "./models/counter";

const appState = new Counter();

const App = observer(({ store }) => (
  <div>
    <div className="count">{store.count}</div>
    <button onClick={() => store.remove()}> - </button>
    <button onClick={() => store.add()}> + </button>
    <div>Ton chiffre au carré est égal à {store.square}</div>

    <style jsx>
      {`
      * {
        margin-bottom: 10px;
      }

      .count{
        width: 50px;
        text-align: center;
        border: 1px solid;
        border-radius: 5px / 10px
      }

      button{
        margin-right: 8px;
      }
    `}
    </style>
  </div>
));

ReactDOM.render(<App store={appState} />, document.querySelector("#root"));
```

Vous avez remarqué la balise style, rien d'exceptionnel, juste un peu d'espace et de clarté.

Si une erreur manifeste s'est glissée dans mes exemples, n'hésitez pas à m'en faire part!