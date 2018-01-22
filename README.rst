PokéBlob
=========

.. |d.js| image:: https://img.shields.io/badge/Discord.js-12.0-blue.svg
.. |node| image:: https://img.shields.io/badge/Node-8.9.4-brightgreen.svg?label=Node
   :target: https://nodejs.org/en/download/
.. |circleci| image:: https://img.shields.io/circleci/project/github/BlobEmoji/pokeblob.svg?label=CircleCI
   :target: https://circleci.com/gh/BlobEmoji/pokeblob
.. |issues| image:: https://img.shields.io/github/issues/BlobEmoji/pokeblob.svg?colorB=3333ff
   :target: https://github.com/BlobEmoji/pokeblob/issues
.. |commits| image:: https://img.shields.io/github/commit-activity/w/BlobEmoji/pokeblob.svg
   :target: https://github.com/BlobEmoji/pokeblob/commits

|d.js| |node| |circleci| |issues| |commits|

PokéBlob is the bot created by the Google Emoji team for the 1 year server anniversary.
It requires Node >=8 and `Discord.js <https://www.npmjs.com/package/discord.js>`__ livrary.

It is not recommended to run an instance of this bot yourself. The code is here primarily for reference and bug fixing.

Prerequisites
-------------

This project has a number of requirements for deployment:

- ``git`` and ``npm`, for acquiring ``discord.js``
- A PostgreSQL >=9.6 server to store data
- ``Docker`` and ``docker-compose``

git
###

Windows
+++++++

``git`` can be used in Windows either by `Git for Windows <https://git-for-windows.github.io/>`__ or subshells such as `MinGW <http://www.mingw.org/>`__.

Linux
+++++

``git`` should be available from your system package manager, for example in Debian-based systems:

.. code-block:: sh

  apt install git

and in Arch-based systems:

.. code-block:: sh

  pacman -S git

PostgreSQL >=9.6
################

Installation
++++++++++++

Installation for PostgreSQL varies based on system:

Windows
^^^^^^^

PostgreSQL for Windows can be installed via the `Windows installers <https://www.postgresql.org/download/windows/>`__ page.

Once you've installed PostgreSQL, open the Start Menu, search for "SQL Shell (psql)", and run it.

If you changed any of the credentials (such as the port) in the installer, type them in, otherwise just press Enter until it asks for your password.

Enter the password you entered into the installer, and psql should load into the postgres user.

Arch Linux
^^^^^^^^^^

Arch includes up to date PostgreSQL packages in their official repositories. To install, simply run:

.. code-block:: sh

  pacman -S postgresql

After installing, you can use ``sudo -u postgres -i psql`` to log in as the default PostgreSQL user.

Debian
^^^^^^

In order to get specific versions of PostgreSQL on Debian, you will need to add an apt repository.

As apt requires root, you must be superuser for all of the below. (you can become superuser using ``sudo su`` if you are not already.)

To add an apt repository, we need to edit ``/etc/apt/sources.list``, or a subrule for it (e.g. ``/etc/apt/sources.list.d/postgres.list``) to contain the following:

.. code-block:: sh

  deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main

(Vary ``stretch-pgdg`` to ``jessie-pgdg``, ``wheezy-pgdg`` depending on your installation)

Once this is done, you must add the PostgreSQL key to apt and update your local package list.

.. code-block:: sh

  wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
  apt update

Finally, we can install PostgreSQL:

.. code-block:: sh

  apt install postgresql-10

Now that PostgreSQL is installed, you can use ``sudo -u postgres -i psql`` to log in as the default PostgreSQL user.