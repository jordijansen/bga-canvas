<?php

namespace objects;
class Undo
{
    public array $displayCardIds;

    public function __construct(array $displayCardIds) {
        $this->displayCardIds = $displayCardIds;
    }
}

?>