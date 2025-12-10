<?php

namespace App\Application\DAO;

use App\Application\DTOs\HumidityDTO;

interface HumidityDAOInterface
{
    public function saveHumidity(HumidityDTO $humidity): void;

    /**
     * @return HumidityDTO[]
     */
    public function getAllHumidity(): array;

    public function clearHumidityHistory(): void;
}
